// import React from 'react'

import { useState } from "react"
import toast from "react-hot-toast"
import { useAuthContext } from "../context/authContext"

const useRegister = () => {
    const [loading, setLoading] = useState(false)
    const {setCurrentUser} = useAuthContext()
    
    const register = async({firstName, lastName, displayName, password, confirmPassword, phoneNumber}) => {

        const validInputs = handleInputError({firstName, lastName, displayName, password, confirmPassword, phoneNumber})

        if(!validInputs) {
            toast.error("Not Valid Inputs")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({firstName, lastName, displayName, password, confirmPassword, phoneNumber})
            })

            const responseData = await res.json()
            console.log(responseData)
            if(responseData.error) {
                throw new Error(responseData.error)
            }


            localStorage.setItem("currentUser", JSON.stringify(responseData))
            setCurrentUser(responseData)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false);
        }

    }

    return {loading, register}

}

export default useRegister

const handleInputError = ({firstName, lastName, displayName, password, confirmPassword, phoneNumber}) => {

    if(!firstName || !lastName || !displayName || !password || !confirmPassword || !phoneNumber) {

        toast.error("Please fill all the fields")
        return false

    }

    if(password !== confirmPassword) {

        toast.error("Passwords do not match")
        return false

    }

    return true

}