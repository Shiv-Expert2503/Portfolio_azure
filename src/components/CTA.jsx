// import React from 'react'
// import { Link } from 'react-router-dom'


// const CTA = () => {
//   return (
//     <section className='cta'> 
//         <p className='cta-text'>Interested in Collaborating? <br className='sm:block hidden'/>
//         I'm actively seeking opportunities to apply my skills in Scientific Machine Learning and MLOps to solve challenging problems. If my work resonates with you, I'd love to connect.</p>
//         <Link to="/contact" className='btn'>Contact</Link>
//     </section>
//   )
// }

// export default CTA



// updated for the new footer
import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className='cta'>
      {/* We'll wrap the text in a div to control its layout */}
      <div className='flex-1 flex flex-col'>
        <h3 className='cta-text' style={{ color: '#004ac0ff' }}>
          Interested in Collaborating?
        </h3>
        {/* Use a normal paragraph tag for the smaller text */}
        <p className='mt-2 text-slate-500'>
          Want this level of expertise for your project? If my work resonates with you, I'd love to connect.
        </p>
      </div>

      <Link to="/contact" className='btn'>
        Contact
      </Link>
    </section>
  );
};

export default CTA;