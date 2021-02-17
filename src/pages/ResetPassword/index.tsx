import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import logo from '../../assets/logo.svg';
import { Container, Content, Background, AnimatedContainer } from './styles';
import Input from '../../components/input/index';
import Button from '../../components/button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const location = useLocation();
  const history = useHistory();

  console.log(location);

  const HandleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Senhas não batem',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;

        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });
        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Ocorreu um erro',
          description: 'Ocorreu um erro na auteração da sua senha',
        });
      }
    },
    [addToast],
  );
  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={HandleSubmit}>
            <h1>Resete sua senha</h1>
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
            />
            <Input
              icon={FiLock}
              name="password_confirmation"
              type="password"
              placeholder="Confirmação da senha"
            />

            <Button type="submit">Resetar</Button>
          </Form>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
