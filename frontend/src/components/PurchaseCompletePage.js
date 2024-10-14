import React, { useEffect, useState } from 'react';

const PurchaseCompletePage = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
      fetch(`/api/session-status?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setPaymentStatus(data.status);
        })
        .catch((error) => console.error('Error fetching session status:', error));
    }
  }, []);

  if (!paymentStatus) {
    return <p>Cargando estado del pago...</p>;
  }

  return (
    <div>
      {paymentStatus === 'complete' ? (
        <h1>Pago exitoso!</h1>
      ) : (
        <h1>Pago fallido o cancelado</h1>
      )}
    </div>
  );
};

export default PurchaseCompletePage;