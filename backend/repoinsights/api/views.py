from django.shortcuts import render
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status


#
@api_view(['POST'])
def github_auth(request):
    code = request.data.get('code')
    if not code:
        return Response({'error': 'Missing code'}, status=400)
    print(code)
    print("CLIENT_ID:", settings.GITHUB_CLIENT_ID)
    print("CLIENT_SECRET:", settings.GITHUB_CLIENT_SECRETS)
    token_response = requests.post(
        'https://github.com/login/oauth/access_token',
        data={
            'client_id': settings.GITHUB_CLIENT_ID,
            'client_secret': settings.GITHUB_CLIENT_SECRETS,
            'code': code,
        },
        headers={'Accept': 'application/json'},

    )

    token_json = token_response.json()
    access_token = token_json.get('access_token')
    print("GitHub Response:", token_response.status_code, token_response.text)

    if token_response.status_code != 200:
        return Response({"error": "GitHub token exchange failed", "details": token_response.text}, status=400)
    if not access_token:
        return Response({'error': 'Token exchange failed'}, status=400)

    return Response({'token': access_token})



@api_view(['GET'])
def get_user_repos(request):
    token = request.headers.get('Authorization')
    if not token:
        return Response({'error': 'Missing token'}, status=status.HTTP_401_UNAUTHORIZED)

    github_headers = {
        'Authorization': token,
        'Accept': 'application/vnd.github.v3+json',
    }

    github_api_url = "https://api.github.com/user/repos"
    github_response = requests.get(github_api_url, headers=github_headers)

    if github_response.status_code != 200:
        return Response({'error': 'Failed to fetch repos'}, status=github_response.status_code)

    return Response(github_response.json())




@api_view(['GET'])
def get_user_orgs(request):
    token = request.headers.get('Authorization')
    if not token:
        return Response({'error': 'Missing token'}, status=401)

    res = requests.get(
        'https://api.github.com/user/orgs',
        headers={
            'Authorization': token,
            'Accept': 'application/vnd.github.v3+json'
        }
    )
    return Response(res.json(), status=res.status_code)


@api_view(['GET'])
def get_org_repos(request, org_name):
    token = request.headers.get('Authorization')
    if not token:
        return Response({'error': 'Missing token'}, status=401)

    url = f'https://api.github.com/orgs/{org_name}/repos'
    res = requests.get(url, headers={
        'Authorization': token,
        'Accept': 'application/vnd.github.v3+json'
    })

    return Response(res.json(), status=res.status_code)



@api_view(['GET'])
def get_repo_workflow(request, userLogin, selectedRepo):
    token = request.headers.get('Authorization')

    if not token:
        return Response({'error': 'Missing token'}, status=status.HTTP_401_UNAUTHORIZED)

    if token.startswith("Bearer "):  
        token = token.split("Bearer ")[-1]

    github_headers = {
        'Authorization': f'token {token}',  
        'Accept': 'application/vnd.github.v3+json',
    }

    github_api_url = f"https://api.github.com/repos/{userLogin}/{selectedRepo}/actions/workflows"

    try:
        res = requests.get(github_api_url, headers=github_headers)
        res.raise_for_status()  
        return Response(res.json(), status=res.status_code)

    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "GitHub API request failed", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@api_view(['POST'])
def trigger_workflow(request, userLogin, selectedRepo, workflowId):
    token = request.headers.get('Authorization')
    if not token:
        return Response({'error': 'Missing token'}, status=status.HTTP_401_UNAUTHORIZED)

    github_token = token.split(' ')[1] if ' ' in token else token
    data = request.data  
    print(github_token)

    url = f"https://api.github.com/repos/{userLogin}/{selectedRepo}/actions/workflows/{workflowId}/dispatches"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json",  
        "Content-Type": "application/json"
    }

    res = requests.post(url, json=data, headers=headers)
    if res.status_code == 204:
        return Response({"message": "Workflow triggered"}, status=200)
    return Response({"error": "GitHub trigger failed", "details": res.text}, status=res.status_code)


@api_view(['GET'])
def get_workflow_runs(request, userLogin, selectedRepo, workflowId):
    token = request.headers.get('Authorization')
    if not token:
        return Response({'error': 'Missing token'}, status=status.HTTP_401_UNAUTHORIZED)
    github_token = token.split("Bearer ")[-1]
    github_headers = {
        'Authorization': f'token {github_token}',
        'Accept': 'application/vnd.github.v3+json',
        }
    github_api_url = f"https://api.github.com/repos/{userLogin}/{selectedRepo}/actions/workflows/{workflowId}/runs"
    try:
        res = requests.get(github_api_url, headers=github_headers)
        res.raise_for_status()
        return Response(res.json(), status=res.status_code)
    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "GitHub API request failed", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
@api_view(['GET'])
def get_workflow_logs(request, userLogin, selectedRepo, runId):
    token = request.headers.get('Authorization')
    if not token:
        return Response({'error': 'Missing GitHub token'}, status=status.HTTP_401_UNAUTHORIZED)
    github_token = token.split("Bearer ")[-1]
    headers = {
        'Authorization': github_token,
        'Accept': 'application/vnd.github.v3+json'
    }

    
    jobs_url = f'https://api.github.com/repos/{userLogin}/{selectedRepo}/actions/runs/{runId}/jobs'
    jobs_res = requests.get(jobs_url, headers=headers)

    if jobs_res.status_code != 200:
        return Response({'error': 'Failed to fetch jobs'}, status=jobs_res.status_code)

    jobs_data = jobs_res.json()
    logs = {}

    for job in jobs_data.get('jobs', []):
        job_id = job['id']
        name = job['name']

        log_url = f'https://api.github.com/repos/{userLogin}/{selectedRepo}/actions/jobs/{job_id}/logs'
        log_res = requests.get(log_url, headers=headers)

        if log_res.status_code == 200:
            logs[name] = log_res.text
        else:
            logs[name] = f"Failed to fetch logs (status {log_res.status_code})"

    return Response({'logs': logs})