export default function LoginBtn(){
    const HandleLogin=()=>{
        const clientId=process.env.REACT_APP_GITHUB_CLIENT_ID
        const redirectUri="http://localhost:3000/callback"
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo%20read:user`;
    }
    return(
        <div>
            <button className="btn btn-dark" onClick={HandleLogin} >
                Login
            </button>
        </div>
    )
}