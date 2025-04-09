import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const [form, setForm] = useState({ email: "", city: "", country: "", zipCode: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("userToUpdate");
    if (data) {
      setForm(JSON.parse(data));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const baseUrl = localStorage.getItem("apiBaseUrl") || import.meta.env.VITE_API_URL;
    const res = await fetch(`${baseUrl}/subscription`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Information updated successfully. Try logging in again.");
      if(localStorage.getItem('weatherData') !== null){
        localStorage.setItem('weatherData', JSON.stringify({ subscription: form }));
      }
      navigate(-1);
    } else {
      alert("Failed to update your information.");
    }
  };

  return (
    <div className="page center-content">
      <div className="form-container">
      <div className="form-nav">
          <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
        </div>
        <h2 className="form-title">Update Your Info</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={form.email} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <input className="form-input" name="city" value={form.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input className="form-input" name="country" value={form.country} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Zip Code</label>
            <input className="form-input" name="zipCode" value={form.zipCode} onChange={handleChange} />
          </div>
          <button type="submit" className="form-button">Update</button>
        </form>
      </div>
    </div>
  );
}
