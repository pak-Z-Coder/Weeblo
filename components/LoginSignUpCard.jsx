import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
const LoginSignUpCard = () => {

    return (
        <Tabs defaultValue="account" className="sm:w-[400px]">
            <TabsList className="w-lg">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signUp">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="border-none">
                <LoginForm />
            </TabsContent>
            <TabsContent value="signUp">
                <SignUpForm />
            </TabsContent>
        </Tabs>

    )
}

export default LoginSignUpCard