'use client';

import {useCallback, useState, useEffect, use} from 'react';
import {useForm, FieldValues, SubmitHandler} from 'react-hook-form';
import router, {useRouter} from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import Input from '../../components/inputs/Input';
type Variant = 'LOGIN' | 'REGISTER';

const Auth = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.status === 'authenticated'){router.push('/conversations');}
    }, [session?.status, router])

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues >({
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        if (variant === 'LOGIN') {
            signIn('credentials', {
                ...data,
                redirect: false,
            }).then((callback) => {
                if (callback?.error) {
                    toast.error('Dcmm Invalid credentials');
                } 
                if (callback?.ok) {
                    router.push("/conversations");
                }
            }).finally(() => setIsLoading(false));
        }
        
        if (variant == "REGISTER"){
            axios.post('/api/register', data).then(() => 
                signIn('credentials', {
                    ...data,
                    redirect: false,
                }).then((callback) => {
                    if (callback?.error) {
                        toast.error('Dcmm Invalid credentials');
                    } 
                    if (callback?.ok) {
                        router.push("/conversations");
                    }
                })
            )
            .catch((err) => toast.error(err.message))
            .finally(() => setIsLoading(false));
        }
    }    

    const action = (action: string) => {
        setIsLoading(true);

        signIn(action, {
            redirect: false,
        }).then((callback) => {
            if (callback?.error) {
                toast.error('Dcmm Invalid credentials');
            } 
            if (callback?.ok) {
                router.push("/conversations");
            }
        })
        .finally(() => setIsLoading(false));
    }   

    return (
        <div>
            <div className='flex flex-col items-center justify-center w-full h-full'>
                <Input/>
            </div>
        </div>
    );
}

export default Auth;