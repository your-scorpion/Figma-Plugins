//DRAFT FILE
import * as React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Button } from '@mui/material';
import { useStyles } from "./use-styles"
import { TextField } from '@mui/material';
import { Chip } from '@mui/material';
import { Avatar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import InputAdornment from '@mui/material/InputAdornment';
import Rotate90DegreesCcwOutlinedIcon from '@mui/icons-material/Rotate90DegreesCcwOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import HeightIcon from '@mui/icons-material/Height';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';

declare function require(path: string): any;

export const MessageList = () => { //это компонент без пропсов
    const styles = useStyles();
    const [message, setMessage] = useState(""); //текущее значение и функция для обновления значения
    const [messages, setMessages] = useState([]);


    const ref = useRef(null); //привязываемся к элементу DOM
    //const textbox = React.useRef<HTMLInputElement>(undefined);

    const onCreate = () => { //туть
        //const count = parseInt(textbox.current.value, 10);
        //let pluginForm = document.querySelector('#formTotal');


        //@ts-ignore
        let pluginFormData = new FormData(formTotal);
        let formDataObj = {};
        for (let [key, value] of pluginFormData.entries()) {
            formDataObj[key] = +value
            //console.log(formDataObj);

        }
        //console.log("заебок");
        parent.postMessage({ pluginMessage: { type: 'create-rectangles', formDataObj } }, '*');

    };

    const onCancel = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    };





    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const { type, message } = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);




    const ref2 = useRef(null);
    useEffect(() => { //зависимости эффекта строятся на том, что внутри эффекта используется
        //console.log("ref",);
        ref.current ? .focus()
    }, []);


    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);







    useEffect(() => { //Хук useEffect нужен для выполнения действий после рендера страницы.
        const lastMessage = messages[messages.length - 1]
        let timerId = null;

        if (messages.length && lastMessage ? .author != "Bot") { //? написать короткую проверку optional chaning
            setTimeout(() => {
                setMessages([...messages, { author: "bot", message: "hi!" }]) //спред-оператор
            }, 742);
        }

        return () => clearInterval(timerId);
    }, [messages])

    const sendMessage = () => {
        if (message) {
            setMessages([...messages, { author: "user", message }]) //спред-оператор
            setMessage("");
        } else { console.log("AAAd A!") }
    };






    const handlePressInput = (event) => { //отправка по энтеру
        if (event.code === "Enter") {
            sendMessage();
        }
    }
    const handleFocus = (event) => event.target.select();



    return ( //компонент возвращает верстку 
        <div className={styles.wrapper}>
			
		

				{messages.map((message, index) => (
					<div 
					key={index}
					ref={ref2}>
						{message.author}
						{message.message}
						<hr />
					</div>))}

{/*////////////////////////////// */}





{/*
							<Input
							className={styles.input}
							fullWidth
							name="fname4"
							onFocus={handleFocus}
							inputRef={ref}
							endAdornment={
								<InputAdornment position="end"> 
							    <AccessAlarm className={styles.icon} onClick={sendMessage}/>
							    </InputAdornment>}

							onChange={(event) => setMessage(event.target.value)}
							onKeyPress={handlePressInput}//в событие приходит эвент
							value={message}
							/>


*/}
<form id="formTotal" autoComplete="on">
<Chip label="All values must be greater than 0" variant="outlined" color="secondary" size="small"
avatar={<Avatar sx={{ bgcolor: deepPurple[100] }}>!</Avatar>} />


		{/*

<div className={styles.field2}>
							<TextField 
							className={styles.input}
							fullWidth
							name="fname1"
							inputRef={ref}
							type="number"
							onFocus={handleFocus}
							defaultValue="100"
							id="outlined-basic" 
							label="Number of elements:" 
							variant="outlined"
							onChange={(event) => setMessage(event.target.value)}
							onKeyPress={handlePressInput}//в событие приходит эвент
							//value={message}
							/> </div>*/}

<div className={styles.field2}> <span><br></br></span>
							<TextField sx={{ m: -1, ml:-2, width: 200 }}
							className={styles.input}
							fullWidth
							name="fname2"
							size="small"
							placeholder="From 0 up to ∞"
							defaultValue="180"
							type="number"
							//helperText="Rotate canvas"
							inputRef={ref2}
							onFocus={handleFocus}


							InputProps={{
							        style: {
							            fontSize:16
							        },
							        inputProps: {
							            min: 1,
							            max: 900,
							            maxLength: 3,
							            pattern: "([^0-9]*)",
							        },
							        startAdornment: (
								      <InputAdornment
								        sx={{
								          padding: "0px 0px",
								        }}
								        position="start"
								      >
								          <Rotate90DegreesCcwOutlinedIcon style={{marginLeft:-4}} />
								      </InputAdornment>
								    )
							     }}	



							id="outlined-basic" 
							label="Canvas Rotation:" 
							variant="outlined"
							required={true}
							onChange={(event) => setMessage(event.target.value)}
							onKeyPress={handlePressInput}//в событие приходит эвент
							//value={message}
							/></div>

<div className={styles.field2}>
							<TextField sx={{ m: -1, ml:-2, width: 200 }}
							className={styles.input}
							fullWidth
							size="small"
							name="fname3"
							inputRef={ref3}
							onFocus={handleFocus}
							type="number"
							placeholder="From 0 up to ∞"
							id="outlined-basic" 
							defaultValue="500"
							label="Total Canvas Width:" 
							required={true}
							variant="outlined"
							onChange={(event) => setMessage(event.target.value)}
							onKeyPress={handlePressInput}//в событие приходит эвент
							InputProps={{
							        style: {
							            fontSize:16
							        },
							        inputProps: {
							            min: 1,
							            max: 900,
							            maxLength: 3,
							            pattern: "([^0-9]*)",
							        },
							        startAdornment: (
								      <InputAdornment
								        sx={{
								          padding: "0px 0px",
								        }}
								        position="start"
								      >
								          <ArrowRightAltIcon style={{marginLeft:-4}} />
								      </InputAdornment>
								    )
							     }}	

							//value={message}
							/></div>

<div className={styles.field2}>
							<TextField  sx={{ m: -1, ml:-2, width: 200 }}
							className={styles.input}
							fullWidth
							name="fname4"
							inputRef={ref4}
							size="small"
							onFocus={handleFocus}
							id="outlined-basic"

							type="number"
							label="Total Canvas Height:" 
							variant="outlined"
							defaultValue="500"
							onChange={(event) => setMessage(event.target.value)}
							onKeyPress={handlePressInput}//в событие приходит эвент
							//value={message}

							InputProps={{
							        style: {
							            fontSize:16
							        },
							        inputProps: {
							            min: 1,
							            max: 900,
							            maxLength: 3,
							            pattern: "([^0-9]*)",
							        },
							        startAdornment: (
								      <InputAdornment
								        sx={{
								          padding: "0px 0px",
								         
								        }}
								        position="start"
								      >
								          <HeightIcon style={{marginLeft:-4}} />
								      </InputAdornment>
								    )
							     }}	

							required={true}
							margin = "dense"
							color = "info"


							placeholder="From 0 up to ∞"
							/></div>


<div className={styles.field2}>
							<TextField  sx={{ m: -1, ml:-2, width: 200 }}
							className={styles.input}
							fullWidth
							size="small"
							name="fname5"
							InputLabelProps={{ shrink: true }}
							inputRef={ref5}
							defaultValue="15"
							//value="15"
							onFocus={handleFocus}
							//helperText="Structure level"
							id="standard" 
							type="number"
							label="Structure level:" 
							variant="outlined"

							InputProps={{
							        style: {
							            fontSize:16
							        },
							        inputProps: {
							            min: 1,
							            max: 900,
							            maxLength: 3,
							            pattern: "([^0-9]*)",
							        },
							        startAdornment: (
								      <InputAdornment
								        sx={{
								          padding: "0px 0px",
								        }}
								        position="start"
								      >
								          <DonutLargeOutlinedIcon style={{marginLeft:-4}} />
								      </InputAdornment>
								    )
							     }}	

							onChange={(event) => setMessage(event.target.value)}
							onKeyPress={handlePressInput}//в событие приходит эвент
							required={true}
							margin = "dense"
							color = "primary"


							placeholder="From 0 up to ∞"
							/></div>
							{/*<Button ref={ref} onClick={sendMessage}>send</Button>*/}

				<div>

				
				{/*Count: <input ref={countRef} />*/}
				<Button variant="contained" sx={ { borderRadius: 28, boxShadow: 1, padding: 1.3, px: 2, mx:-11.4 } }
				style={{border: '0px solid white'}}
				onClick={onCreate}>Create</Button> <span>             </span>

				<Button variant="outlined" sx={ { borderRadius: 28, boxShadow: 1, padding: 1.3, px: 2, mx:-11.4} } onClick={onCancel} >Cancel</Button>
				
		 </div>			
	 </form>
   </div>

    );
};