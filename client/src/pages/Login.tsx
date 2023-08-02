
import "bootstrap/dist/css/bootstrap.min.css"
export const Login = () => {
    return (
        <div>
            <div className="container d-flex justify-content-center min-vh-100 align-items-center">
        <div className="p-4 bg-white shadow-lg rounded-3 bg-gradient ">

        <form>
            <h1 className=" text-center ">LOGIN</h1>
            <div className="form-group">
                <label >Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                    placeholder="Enter email" />

            </div>
            <div className="form-group">
                <label >Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            
            <div className=" d-flex justify-content-center">
            <button type="submit" className="btn btn-primary m-4 ">Submit</button>
            </div>
            <div className=" d-flex justify-content-center">
            <a href="/signIn">New user?</a>
            </div>
        </form>
        </div>
    </div>
        </div>

    )
}