import React from 'react';

import { useTransition } from 'react-spring';
import Toast from './Toast';

import { Container } from './styles';

import { ToastMessagesTypes } from '../../hooks/Toast';

interface ToastContainerProps {
  messages: ToastMessagesTypes[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    messages => messages.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
    },
  );
  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} message={item} />
      ))}
    </Container>
  );
};

export default ToastContainer;
