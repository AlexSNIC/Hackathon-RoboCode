import React from 'react'

const HyperLinks = (props) => {
  return (
    <div {...props} className='hyperlinks'>
      <ul>
        <li><a target='_blank' href="https://github.com/AlexSNIC"><i className="bi bi-github"></i>AlexSNIC</a></li>
        <li><a target='_blank' href="https://www.instagram.com/alexandry_solomon/"><i className="bi bi-instagram"></i>@alexandry_solomon</a></li>
        <li><a target='_blank' href="https://www.facebook.com/alexandru.solomon.716"><i className="bi bi-facebook"></i>alexandru.solomon.716</a></li>
      </ul>
    </div>
  )
}



export default HyperLinks