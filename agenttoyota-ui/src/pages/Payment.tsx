import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const TOYOTA_RED = "#EB0A1E";

export default function Payment() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    billingZip: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const vehicleName = sp.get("vehicle_name") || "Toyota Vehicle";
  const monthlyPayment = sp.get("monthly_payment") || "0";
  const downPayment = sp.get("down_payment") || "0";
  const financingType = sp.get("type") || "loan";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }

    // Limit CVV to 4 digits
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    // Limit expiry fields
    if (name === "expiryMonth") {
      formattedValue = value.replace(/\D/g, "").slice(0, 2);
      if (parseInt(formattedValue) > 12) formattedValue = "12";
    }

    if (name === "expiryYear") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    // Limit zip code
    if (name === "billingZip") {
      formattedValue = value.replace(/\D/g, "").slice(0, 5);
    }

    setFormData({ ...formData, [name]: formattedValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    if (!formData.cardName || formData.cardName.length < 3) {
      newErrors.cardName = "Please enter the name on card";
    }

    if (!formData.expiryMonth || parseInt(formData.expiryMonth) < 1 || parseInt(formData.expiryMonth) > 12) {
      newErrors.expiryMonth = "Invalid month";
    }

    if (!formData.expiryYear || formData.expiryYear.length !== 4) {
      newErrors.expiryYear = "Invalid year";
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "Invalid CVV";
    }

    if (!formData.billingZip || formData.billingZip.length !== 5) {
      newErrors.billingZip = "Invalid ZIP";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "American Express";
    if (/^6(?:011|5)/.test(cleaned)) return "Discover";
    return "";
  };

  return (
    <div>
      <style>{CSS}</style>

      <header>
        <div className="wrap">
          <div className="brand">
            <img
              alt="Toyota logo"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAk1BMVEXrCh7////qAADrABrrABPrABbrABDrABHqAAvqAAXrAxv2qa3+9PX3r7P5xMf+8fLuQk396uz/+vr1mZ783uD72dvvWWH6zM71n6P4vcDvTlfzio/85ufyfoT3tLftLzvtOUTwYGjxanH0k5jyeX/7293xcHfsIzH60dTsGyv2pKjzi5HsEyb0lZrvUlvtQEntKjd8Xkv0AAAMI0lEQVR4nO2d13riOhCAYVywTTe9904S3v/pjiEgW9LIsmII2fPNf7fBRWNJo2nSFgoEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRB/jsBybNfzIYnn2o717oblJnDcm1jBbNjdTlb9Y3UaUS2Xj/3WaNttHG6/eqV/UlLLjdrufK1X014zLKoIK+3e9LTYRZL6dvDuNmcmKEXCzZb9XlMpmUilPV11C1F3Ou9uvB4HoLDo79XdlkK9Npr/bSmDaGQO+5ufCBf3Zm00A7DfLQpKCazt4Ed9J9IsD6M5/G55BGyARe0Z0t2pVCMh/46KDXwYTp/Se0nq/R2U3i3aDQtgNNa0trmvlU/75F+qH9Vep6K5rbcA7+1riAO7srqJ4bh2XHcPNyNmyv80uf1xvhxN9/WUTxNd9lYZHZgPVI3blNez68ro2dF8CqAn/r6C6wNKXnTJobuqqRbPSuuNMlowx7VL2Ft9XmVzWNMAuXAN7EF2ZNScl2V8oQk/fMAb8GIC2KH9N+5/+pENxl0LfezKBqdIrnZeYT3Fhmx4AvdXZbvhwRFpS+d0Xa/FUVUaop1Tl4ZfEI3ZRhlRQM3lby+QFqzldlz1u480JACFLqlioy+y+7rImN5ffnWownkvNaGzUK3R0MIFLBbneMeUoPAhf5TW73VjAGvp9b0v5fJsnVUCFveqfokW2bWkXcfzX+pG15U0/2aY8n2hqpSwOFTb2B6cpMtHv7JwQFecgeE6zRkIHLWA6k68vakkKeue93JDLpAn1ebsp92hnoVXFDPx8bKteH3968Uj1QLpsw40CkClSL9B1Wni5rmksrcvFdFxJbNjoJka7pLrgv52whuomva6O8lpab1QxNJZ0m9t3dzn7LUpgOvBLOmKbDXWiteQ+n36Mn1TmslO4EWzRgVe4uLjd9McSIjY0/UIYjvVXiRi6SILWNO1z03oCiaMc0g8qaRpLbac9l4ioi3PiMg/8DR3JQZpJfZmvUX8iKXOqAbZftJ/2R9gOZhO/NRExQI/1oXbxNdIuItT7TCdIi/W3mVMAG3kPcWFZgF2Yq+inWyTM2N/r2slRJ2007NFxFzYiA/NexLL/YIbjYlmzzTKCv+2xYVugpgBI/QtfMdg97E5NOavdObsGZq57FzwV4e7Z7oatrwo3emmNw+YdhoJF0Ln8YtmSuGDNMPXNSEAZZKlkppmcL7YhaLj700UvSsAXdWri+XniSj4P5y47TSzNBZDUu+BqxSeezUfAOH1+eezHA37k3tuj/d/24F6oMafRjbO4gWjkeJbCj3IG+JaNZwV4ELaoXXg3xoulBmGeLL5Uj/F/TtRfSJXjNHVYcH9+0lGuD/hnjoBycgYBKoIzWNUIZ6uxXSkYj7Z0BWn/xGEVevwjOxN4HHWWqTBbHnylw/YdAwKj98/ECeZDQ3U+HZhKFtrZ8vZcX94imkDK+6Z3RJnczFqSM4vtmiGiPzMGmtKzXQAtsg6348uBD5N8oRODIDrws21NVahiDBuidFgNtVCF1GXHtNY3CS1PIBhFUtLja8ehfDuJ3Six1sz356AxznuiTYcu3bk5D6+K7PZNmjol5k1zG67RvYP66ki6/Z9mWCIF3L7UbxV+NDP6vBS2CkvD/e0DDNH8GgMPO7p2pHrcktCbavqVOTCFz7MjVXeTrT5FZepZzzXwsTclyeNM7D5iq8H8Aj6rMHfDSfHfWrGlEWg8G/+YwRzJg5aIPFakUr70eQhoDyePR7rssHJEJvPvzklqJxNQu7dSWMXFHMRJayPN519rzaYViOm00GvsxkbpP7DYfxmQddo4pE6BIOtn3wazLMXPeVkf04afbyNJa81RgjTjV/WHDSF+AJGvMkkvFbnQWsk7HAPEz8XfOH+91OpHYTX8kFmyfM0Iihxz5J9Tge2Lx6q7a5k81oz7opccTeH9+0xA8KDra6aJo98Sywtyau/dA9ag8e7Fbiz4kEXsVOfQa+LVygIsSknh1kjrIaqmFEJdkf9imZIvTxTpSUFFwoz6zNLyD9KHf+1ABbPKUz8JpwuUsoTBdN0mSOYIajS1I9VAuhWn6J2xuVPSC3aE5aLU2qGViMhP/ZSAio3Ir9iPurl6sr6YHLRVtAKdv8xh6rhfcP0lPQ3Vxdhvq5ufjAtK53qehc5JXqf1ued8jx2myDhV7YpfZXSvyxWg8zLSOdesO9m89iFPszjBQsS6kZpEqvkw2OtGbfHdWnsViJj/BGouoBvsulCmId5lnxBwq6Zo8JW08nNIy4cZl+NG/PL+foB4sBZhuHPNYsP9A+eJ6E2H8rDJFxFyi4IAsty7ljRvwqJvI2h8SwsYrlGKR9FNwzAslATFku8Pf5hm1zMIma8+5QrfwF8cYnhcHAfEvYV97GEz85IwsDnh5bq8VkQAqOGNi6rUlCpczZEzkaWpRCLUmcFMiAW3ZlJWFrcb1Mou8B+rJq6egwewR8wVYD8s0Z5nsVCIIr6vDjFY/blxNIFw1nM4Qjly2b2Ebtbka2NR5uhhLz1G+bxD8XKSbPEcpwBViSXHhmeitljhcR+agWnFrEOwmjhslieCN/5wuaAmQYT4+35kohCpsfsaYH9uA0391ggz2xoCKuhtmopHaYO75gFJ5lJhBcgsrXIaJwJeYZ80/CaW+Mfd0sfZoatd/iazDrDyJIQq0/ylriJzzP63MzuxFvBvp6J2SXlLnUFqjrEYWrkQTELGR3cccZgZRCGEDVDmLsQUyzT1la8oq3BktEeyyFpCzBjxEKQvImZays/hEcaZLPiPBg2lGIfyCAcKNWAZYw7pBCr/DsGqj1OMGAuXBzmyl5uIBXY5Vvu7w0R94iOMj80riJFMrWxRWig78W1MOdi+I1cZ5257DHR/7KCir8cWseAIiWeO08pipJS9gYtYjayvCDEKizzimYLjqGZZlcjVNQUDWy32IOWjOvEMqQKcsgNEcdonhhUErl6RlM3y0iE/bZiBW0cPtAVi7NbpFrap52HIlV5hedsoyOx20Ksgo5ra4vnjHFgqRJ7kiNhwWMF4jht2plalSjJL6655iTqGzNWxAiFl0Uz40OHPE472YylRGonTDqJyW132RSNJ+2WDoNnHpwh7wPNtjEnOb4Tn9xO2l6ZkmOepEYzK4OMgLQtL5OIXJao+rjDLSQjLVlsNu9LynvotnqYYllSvmyfYW81H9qsATiWZUMj+awsFg3IuyGev/PJnkkvaRf0ap53TcLV/LDr8ko/Q1NlJZNVDxiBbHWs6LePo9uyOPQRa5hIN40zZhrNwPZ2aDfllrT1fbrV0EF2uzdfdFwWJmJZNxnFQI+Iznb2znJh2Th41ekKgJzgMdacV6HctnQnvSotwGo8U7fp5MSbI4UWk9QXIlsXOLAa9/h9HvJ9ei89Iss9I9UH+12aYlPvCruS5h04sERKOl63k/vxVmyrZQtS9j6tkBsYagcvgB1WLjd5+ekfAVrgXd8qi5ikoHISpZ4JwMdq5euN3zjeBK9+bi9UJx2llfWrQujgn7DSqtovneBm4+extLf46WpBoBQQj4dYACe0pmrya6d+BfIJLjfGa7SgUL1xAZuFNhz6aGncXqyGfimujx+rUzlekI5UqVM5Xh113xBfQMPtL5+FFcC8g7akuJ/YopBiQuyOeNaX5cGhpTjr5ZiirV9FtFqpVrre2uEP/cLH6bDEPQ7OE+R8iBu12XvO3XNhpCyy3J8aybOBMReDWe2BDdHg/FCMiWhJSTuF6sX4MFKfIHQ9W7AA95JKeVPm7dgH53qgcjD8SCm77Q3feyStD+vUTSXjWmt54bZx3Vl/n325baVXoQ7m7z+N1oNP7emz9U7tOOJ0ZH/Un+51VeH1fuH98l2JVrDVC3aV1JSH+L0By4d5OfVML1M2J/+PnLHLiLT9sPykntyPdiAfUfAHiIS85NyMUCw2p8tM9frvIjJL3GHrp1I2B5NZtLr8xd5Lclu/vybTjtG8bO6P1y3gf/nIeZ7b3vPz56i6l7ch8ISbWmv9FQ1w+Af/E4jAvsoJh8Zi0i9Pa/v2g02nVxuU+6dtd14A/kjlfxLr+0hrGd+1/3HRCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIL4P/IfOM+nA+kZ+EsAAAAASUVORK5CYII="
            />
            <h1>Secure Payment</h1>
          </div>
        </div>
      </header>

      <div className="wrap payment-container">
        <div className="payment-layout">
          {/* Left side - Payment form */}
          <div className="payment-form-section">
            <div className="card">
              <h2>Payment Information</h2>
              <p className="subtext">Complete your {financingType} application for {vehicleName}</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? "error" : ""}
                    />
                    {getCardType(formData.cardNumber) && (
                      <span className="card-type">{getCardType(formData.cardNumber)}</span>
                    )}
                  </div>
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cardName">Name on Card *</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={errors.cardName ? "error" : ""}
                  />
                  {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryMonth">Expiry Date *</label>
                    <div className="expiry-inputs">
                      <input
                        type="text"
                        id="expiryMonth"
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                        placeholder="MM"
                        maxLength={2}
                        className={errors.expiryMonth ? "error" : ""}
                      />
                      <span className="separator">/</span>
                      <input
                        type="text"
                        id="expiryYear"
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                        placeholder="YYYY"
                        maxLength={4}
                        className={errors.expiryYear ? "error" : ""}
                      />
                    </div>
                    {(errors.expiryMonth || errors.expiryYear) && (
                      <span className="error-text">{errors.expiryMonth || errors.expiryYear}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className={errors.cvv ? "error" : ""}
                    />
                    {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="billingZip">Billing ZIP Code *</label>
                  <input
                    type="text"
                    id="billingZip"
                    name="billingZip"
                    value={formData.billingZip}
                    onChange={handleInputChange}
                    placeholder="12345"
                    maxLength={5}
                    className={errors.billingZip ? "error" : ""}
                  />
                  {errors.billingZip && <span className="error-text">{errors.billingZip}</span>}
                </div>

                <div className="security-notice">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1L3 3V7C3 10.5 5.5 13.5 8 15C10.5 13.5 13 10.5 13 7V3L8 1Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Your payment information is encrypted and secure</span>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Complete Payment
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right side - Payment summary */}
          <div className="payment-summary-section">
            <div className="card summary-card">
              <h3>Payment Summary</h3>

              <div className="summary-item">
                <span className="label">Vehicle</span>
                <span className="value">{vehicleName}</span>
              </div>

              <div className="summary-item">
                <span className="label">Financing Type</span>
                <span className="value">{financingType === "loan" ? "Auto Loan" : "Lease"}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-item">
                <span className="label">Monthly Payment</span>
                <span className="value highlight">${parseFloat(monthlyPayment).toFixed(2)}</span>
              </div>

              <div className="summary-item">
                <span className="label">Due at Signing</span>
                <span className="value">${parseFloat(downPayment).toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-item total">
                <span className="label">Today's Payment</span>
                <span className="value">${parseFloat(downPayment).toFixed(2)}</span>
              </div>

              <div className="accepted-cards">
                <p className="small-text">We accept:</p>
                <div className="card-logos">
                  <span>💳 Visa</span>
                  <span>💳 Mastercard</span>
                  <span>💳 Amex</span>
                  <span>💳 Discover</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" fill="#4CAF50" />
                <path
                  d="M20 32L28 40L44 24"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2>Payment Successful!</h2>
            <p>Your payment has been processed successfully.</p>
            <p className="redirect-text">Redirecting to home page...</p>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
:root {
  --toyota-red: #EB0A1E;
  --bg: #f8f9fa;
  --text: #0f0f0f;
  --border: #e0e0e0;
  --success: #4CAF50;
  --error: #f44336;
  --card-shadow: 0 2px 8px rgba(0,0,0,.08);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

header {
  background: linear-gradient(135deg, var(--toyota-red), #c9001f);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
}

.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand img {
  height: 40px;
  filter: brightness(0) invert(1);
}

.brand h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.payment-container {
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 80px);
}

.payment-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 968px) {
  .payment-layout {
    grid-template-columns: 1fr;
  }
  
  .payment-summary-section {
    order: -1;
  }
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.card h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.subtext {
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text);
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
}

input:focus {
  outline: none;
  border-color: var(--toyota-red);
  box-shadow: 0 0 0 3px rgba(235, 10, 30, 0.1);
}

input.error {
  border-color: var(--error);
}

input.error:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.error-text {
  display: block;
  color: var(--error);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.input-with-icon {
  position: relative;
}

.card-type {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--toyota-red);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.expiry-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.expiry-inputs input {
  flex: 1;
}

.separator {
  font-size: 1.25rem;
  font-weight: bold;
  color: #999;
}

.security-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f0f7ff;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: #1976d2;
  font-size: 0.9rem;
}

.security-notice svg {
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary {
  background: var(--toyota-red);
  color: white;
}

.btn-primary:hover {
  background: #d00919;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(235, 10, 30, 0.3);
}

.btn-secondary {
  background: white;
  color: var(--text);
  border: 2px solid var(--border);
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.summary-card {
  position: sticky;
  top: 2rem;
}

.summary-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.summary-item .label {
  color: #666;
  font-size: 0.95rem;
}

.summary-item .value {
  font-weight: 600;
  font-size: 1rem;
}

.summary-item .value.highlight {
  color: var(--toyota-red);
  font-size: 1.25rem;
}

.summary-item.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid var(--border);
}

.summary-item.total .label {
  font-weight: 600;
  color: var(--text);
  font-size: 1rem;
}

.summary-item.total .value {
  color: var(--toyota-red);
  font-size: 1.5rem;
}

.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 1.5rem 0;
}

.accepted-cards {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.small-text {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.75rem;
}

.card-logos {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.card-logos span {
  font-size: 0.85rem;
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  max-width: 400px;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.success-icon {
  margin-bottom: 1.5rem;
  animation: scaleIn 0.5s;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.modal-content h2 {
  color: var(--success);
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

.modal-content p {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.redirect-text {
  color: #999;
  font-size: 0.9rem;
  margin-top: 1rem;
}
`;

