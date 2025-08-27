import './Header.css'

export default function Header() {
  return (
    <header className='HeaderMain'>
      <div className='header_cvr'>
        <div className='header_logo'>STANLEY</div>
        <nav>
          <div className=""><a href="#">Discover</a></div>
          <div className=""><a href="#">Product</a></div>
          <div className=""><a href="#">Solution</a></div>
          <div className=""><a href="#">Reach</a></div>
        </nav>
        <div className="btnCvr">
          <button className="">Order</button>
        </div>
      </div>
    </header>
  )
}
