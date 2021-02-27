import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiLock, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { Container, Content, Background, AnimatedContainer } from './styles';
import Input from '../../components/input/index';
import Button from '../../components/button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const history = useHistory();
  const { addToast } = useToast();

  const HandleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório')
            .email('Informe um email válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Ocorreu um erro',
          description:
            'Ocorreu um erro na autenticação, verifique as suas credenciais',
        });
      }
    },
    [signIn, addToast],
  );
  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={HandleSubmit}>
            <h1>Faça seu logon</h1>
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Entrar</Button>
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Form>
          <Link to="/registrar">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
