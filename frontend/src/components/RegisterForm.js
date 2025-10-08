import React, { useState } from 'react';

const RegisterForm = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://marketmaestroo.in:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

  const data = await res.json();
    if (res.ok) {
      setMessage('User registered successfully!');
    } else {
      console.error('Error:', data);
      setMessage(`Error: ${data.message || 'Something went wrong'}`);
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <br />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterForm;
