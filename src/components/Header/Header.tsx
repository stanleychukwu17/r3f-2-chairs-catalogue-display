import './Header.css'
import { motion } from 'framer-motion'
import { linkVariant, logoVariant, btnVariant } from './HeaderVariant'

const links = [
  {title: "Discover", href: ""},
  {title: "Product", href: ""},
  {title: "Solution", href: ""},
  {title: "Reach", href: ""},
]

export default function Header() {
  return (
    <header className='HeaderMain'>
      <div className='header_cvr'>
        <motion.div variants={logoVariant} initial="initial" animate="animate" className='header_logo'>
          <a href="https://www.stanleychukwu.com">STANLEY</a>
        </motion.div>
        <nav>
          {links.map((link, index) => {
            return (
              <motion.div variants={linkVariant} initial="initial" animate="animate" custom={index} key={index}>
                <a href={link.href}>{link.title}</a>
              </motion.div>
            )
          })}
        </nav>
        <motion.div variants={btnVariant} initial="initial" animate="animate" className="btnCvr">
          <button className="">Order</button>
        </motion.div>
      </div>
    </header>
  )
}
