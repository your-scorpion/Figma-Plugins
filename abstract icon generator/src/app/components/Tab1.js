import React from 'react'
import {useState} from 'react';

export function Tab1() {

const [text1, useText1] = useState('first');
const [text2, useText2] = useState('second');

  return (
       <div className = 'container'> 
       <h3>knalkd</h3>

   <input onChange={(e) => useText1(e.target.value)} value={text1} />
   <input onChange={(e) => useText2(e.target.value)} value={text2} />
       </div>
  )
}