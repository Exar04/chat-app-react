
import "bootstrap/dist/css/bootstrap.min.css"


interface NavPageProps {
    UserId: number | undefined 
}
// export const ChatSection: React.FC<ChatProps> = ({ selectedChatId, userId }) => {
export const NavBar: React.FC<NavPageProps> = ({UserId }) => {

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-lg">
        <div className="container-fluid">
          <div className="navbar-brand" >WeChat { UserId } </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse d-flex justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link " aria-current="page" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Status</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">LogOut</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
}