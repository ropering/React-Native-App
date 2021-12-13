/*
    비밀번호 별표 표시
    회원가입 페이지에서 이메일 확인 여러번 반복
    비밀번호 확인 textinput 추가
    로그인, 비밀번호 찾기 추가
    메인 페이지(게시글)

비밀번호 찾기 완료하면 결국 어떻게 되는가?
로그인 상태 저장
페이지 나눔
로그인 상태에 따라 로그인 페이지 or 메인 페이지 이동 선택
    firebase.auth().onAuthStateChanged(user => {
        this.props.navigation.navigate(user ? 'Main' : 'SignUp')
        })
*/

import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    TextInput,
    Button,
    TouchableOpacity,
} from 'react-native';
import { createNavigationContainer, NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// 메인 페이지 (게시글 목록)
function MainPage() {
    return (
        <View>
            <Text>
                Hi
            </Text>
        </View>
    )
}
// 로그인 페이지
function SignInPage({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>로그인 회원가입</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="E-mail"
                keyboardType='email-address'
                autoCompleteType='off'
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={true}
            />
            <View style={styles.buttons}>
                <Button title="로그인" onPress={() => SignIn(email, password, {navigation})} />
                <Button title="회원가입" onPress={() => navigation.navigate("RegisterPage")} />
            </View>
            <View style={styles.buttons}>
                <Button title="비밀번호 찾기" onPress={() => navigation.navigate("FindPasswordPage")} />
            </View>
        
        </View>
    )
}
// 로그인 로직 함수
function SignIn(email, password, {navigation}) {
    try {
        auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log("로그인 완료")
                navigation.navigate('MainPage')
            });
      } catch (error) {
        alert(error.message);
      }
}
// 회원가입 페이지
function RegisterPage({navigation}) {
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [email, setEmail] = useState('');
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>회원가입</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => setEmail(value)}
                    placeholder="E-mail"
                    keyboardType='email-address'
                    autoCompleteType='off'
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => setPassword(value)}
                    placeholder="Password"
                    autoCompleteType='off'
                    secureTextEntry = {true}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => setRePassword(value)}
                    placeholder="Password"
                    autoCompleteType='off'
                    secureTextEntry = {true}
                />
            <Button title="이메일 검사" onPress={() => verifyEmail(email, password, rePassword, {navigation})}/>
        </View>
    )
}
// 회원가입 로직 함수
const verifyEmail = (email, password, rePassword, {navigation}) => {
    var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (rePassword != password) {
        alert("비밀번호가 일치하지 않습니다")
    }

    if (regExp.test(email) == true) {
        let searchValue = '@student.anu.ac.kr'
        let isValid = email.indexOf(searchValue);
        if (isValid != -1) { // 다시 바꾸기
            alert("안동대학교 이메일 주소를 입력해주세요")
        } else {
            try {
                auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    userCredential.user ?.sendEmailVerification();
                    alert("이메일 인증이 전송되었습니다")
                    navigation.navigate('Main');
                })
                .catch(function(error) { // 에러코드별 처리 해야함
                    console.log(error.code);
                })
            } catch (error) {
                alert(error);
            }
        }
    }
    else {
        alert('올바른 이메일 주소를 입력해주세요');
    }
}
// 비밀번호 찾기 페이지
function FindPasswordPage() {
    const [email, setEmail] = useState('');
    return (
        <View style={(styles.screen)}>
            <Text style={(styles.title)}>
                비밀번호 찾기 화면입니다
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setEmail(value)}
                placeholder="E-mail"
                keyboardType='email-address'
                autoCompleteType='off'
            />
            <Button title="이메일 확인" onPress={() => emailCheck(email)}/> 
        </View>
    )
}
/*
bonoboss1028@student.anu.ac.kr
audrbs1028@naver.com / 123123
*/
// 비밀번호 찾기 로직 함수
const emailCheck = (email) => {
    if (!email) {
        console.log("이메일이 입력되지 않았습니다")
    }
    else {
        auth().sendPasswordResetEmail(email)
            .then(() => {
                console.log("비밀번호 재설정 이메일이 전송되었습니다");
            })
            .catch(function(error) {
                if (!error.code) { 
                    console.log("비밀번호 재설정 메일을 전송하였습니다")
                } else {
                    if (error.code == 'auth/invalid-email') {
                        console.log("이메일이 유효하지 않습니다")
                    } else if (error.code == 'auth/user-not-found') {
                        console.log("이메일이 존재하지 않습니다")
                    } else if (error.code == 'auth/too-many-requests'){
                        console.log("이메일이 너무 많이 요청되었습니다")
                    } else {
                        console.log(error.code)
                    }
                }
            });
    }
  
}
// 페이지 이동 위한 StackNavigator 변수 선언 및 초기화
const Stack = createStackNavigator();

class App extends React.Component{
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="SignInPage"
                        component={SignInPage}
                    />
                    <Stack.Screen
                        name="RegisterPage"
                        component={RegisterPage}
                    />
                    <Stack.Screen
                        name="FindPasswordPage"
                        component={FindPasswordPage}
                    />
                    <Stack.Screen
                        name="MainPage"
                        component={MainPage}
                    />

                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}
export default App;

// CSS 스타일
const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        margin: 10,

    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 21,
        marginBottom: 30,
        fontFamily: 'BMDoHyeon',
      },
      input: {
        width: 300,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#6d69c3',
        marginVertical: 10,
        padding: 15,
        fontFamily: 'BMDoHyeon',
        
      },
      buttons: {
        width: 150,
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        fontFamily: 'BMDoHyeon',
        
      },
})