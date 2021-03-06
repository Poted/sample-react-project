import React, { Component } from 'react';
import UserStore from '../components/userStore';
import { values } from 'mobx';
import { Link } from 'react-router-dom';
import InputField from './InputField'
import SubmitButton from './SumbitButton';


class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            buttonDisabled: false
        }
    }


    setInputValue(property, val) {
        val = val.trim();
        if (val.length > 12) {
            return;
        }

        this.setState({
            [property]: val
        })
    }


    resetForm() {
        this.setState({
            username: '',
            password: '',
            buttonDisabled: false
        })
    }


    async doLogin() {

        if (!this.state.username) {
            return;
        }
        if (!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true //This will propably blow up application.
        })

        try {

            let res = await fetch('/login', {
                method: 'post',
                headers: {
                    'Accept': 'appplication/json',
                    'Content-Type': 'appplication/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            });   
            
            let result = await res.json();
            if (result && result.success) {
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
            }

            else if (result && result.success === false) {
                this.resetForm();
                alert(result.msg);
            }
            
        } 
        
        catch (e) {
            console.log(e);
            this.resetForm();
        }

    }

    render() {
        return (
            <div className="loginBody">
            <form>
                <img className="mainImg" src={require("../assets/scroll.png")}/>

                <div className="login">
                    <img className="loginImg" src={require("../assets/coin.png")}/>
                    <InputField 
                        type="text"  
                        placeholder="Username.."
                        value={ this.state.username ? this.state.username : '' } 
                        onChange={ (val) => this.setInputValue('username', val) }
                    />
                </div>

                <div className="password">
                    <img className="passwordImg" src={require("../assets/key.png")}/>
                    <InputField 
                        type="password"     
                        placeholder="Password.."
                        value={ this.state.password ? this.state.password : '' }
                        onChange={ (val) => this.setInputValue('password', val) }    
                    />
                </div>

                
            {/* <div className="rememberCheckbox">
                    <input type="checkbox"/>
                    Remember Me
                </div>
                
                <input type="submit" value="Login" className="loginBtn"/>
            */}
                {/*
                <Link to={"/home"}>
                    <input type="submit" value="Login" className="loginBtn"/>
                </Link>
            */}

                <SubmitButton
                    text='Login'
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doLogin() }
                />
                
                <div style={{ visibility: UserStore.loading ? 'visible' : 'hidden', color: 'white', fontSize: '25px' }}>Your profile is loading..</div>
            
            </form>
        </div>
        );
    }

}

export default LoginForm;