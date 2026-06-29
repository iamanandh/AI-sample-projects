import { useState } from 'react'
function Component(){
   const [count , setCount]= useState(0);
   return(
    <>
      <div>
        <p>Current count: {count}</p>
        <button onClick={() => setCount(count + 1)}>add</button>
      </div>
    </>


    
   );
  }
  export default Component;