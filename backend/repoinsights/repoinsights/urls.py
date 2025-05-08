"""
URL configuration for repoinsights project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import github_auth,get_user_repos,get_repo_workflow,trigger_workflow,get_workflow_runs,get_workflow_logs,get_user_orgs,get_org_repos

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/github-auth/', github_auth),
    path('api/user-repos/',get_user_repos),
    path('api/repo-workflow/<str:userLogin>/<str:selectedRepo>/',get_repo_workflow),
    path('api/workflows/<str:userLogin>/<str:selectedRepo>/<int:workflowId>/trigger/', trigger_workflow),
    path('api/workflowruns/<str:userLogin>/<str:selectedRepo>/<int:workflowId>/runs/',get_workflow_runs),
    path('api/workflowlogs/<str:userLogin>/<str:selectedRepo>/<int:runId>/', get_workflow_logs),
    path('api/user-orgs/', get_user_orgs),
    path('api/org-repos/<str:org_name>/', get_org_repos),
]
