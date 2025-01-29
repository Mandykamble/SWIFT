// // src/components/SwiftMT541Creator/SwiftMT541Creator.js
// import React, { useState } from 'react';
// import './SwiftForm.css';

// const SwiftMT541Creator = () => {
//   // [Paste the full component code from previous answer here]
// };

// export default SwiftMT541Creator;


import React, { useState } from 'react';
import './SwiftForm.css';

const SwiftMT541Creator = () => {
  const [formData, setFormData] = useState({
    senderBIC: '',
    receiverBIC: '',
    transactionType: 'Buy',
    isin: '',
    quantity: '',
    currency: 'USD',
    tradeDate: '',
    settlementDate: '',
    accountNumber: '',
    executingBroker: '',
    clientReference: ''
  });

  const [errors, setErrors] = useState({});
  const [messageOutput, setMessageOutput] = useState('');

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'senderBIC':
      case 'receiverBIC':
        if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value)) {
          error = 'Invalid SWIFT/BIC code';
        }
        break;
      case 'isin':
        if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(value)) {
          error = 'Invalid ISIN format';
        }
        break;
      case 'quantity':
        if (!/^\d+$/.test(value)) {
          error = 'Quantity must be a whole number';
        }
        break;
      case 'tradeDate':
      case 'settlementDate':
        if (!/^\d{8}$/.test(value)) {
          error = 'Date must be in YYYYMMDD format';
        }
        break;
      case 'currency':
        if (!/^[A-Z]{3}$/.test(value)) {
          error = 'Invalid currency code';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const generateSwiftMessage = () => {
    const {
      senderBIC,
      receiverBIC,
      transactionType,
      isin,
      quantity,
      currency,
      tradeDate,
      settlementDate,
      accountNumber,
      executingBroker,
      clientReference
    } = formData;

    return `{1:F01${senderBIC}XXXX0000000000}
{2:I541${receiverBIC}XXXXN}
{4:
:16R:GENL
:20C::SEME//${clientReference}
:23G:NEWM
:22F::STTY//${transactionType}
:22F::REDE//TRAD
:16S:GENL
:16R:TRADDET
:35B:ISIN ${isin}
:98A::TRAD//${tradeDate}
:98A::SETT//${settlementDate}
:90B::DEAL//${currency}${quantity}
:16S:TRADDET
:16R:FIAC
:97A::SAFE//${accountNumber}
:16S:FIAC
:16R:SETDET
:22F::SETR//TRAD
:16S:SETDET
:16R:SETPRTY
:95C::PSET//${executingBroker}
:16S:SETPRTY
-}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (!hasErrors) {
      setMessageOutput(generateSwiftMessage());
    }
  };

  return (
    <div className="swift-container">
      <h1>SWIFT MT541 Message Generator</h1>
      <form onSubmit={handleSubmit} className="swift-form">
        <div className="form-group">
          <label>Sender BIC:</label>
          <input
            type="text"
            name="senderBIC"
            value={formData.senderBIC}
            onChange={handleInputChange}
            required
          />
          {errors.senderBIC && <span className="error">{errors.senderBIC}</span>}
        </div>

        <div className="form-group">
          <label>Receiver BIC:</label>
          <input
            type="text"
            name="receiverBIC"
            value={formData.receiverBIC}
            onChange={handleInputChange}
            required
          />
          {errors.receiverBIC && <span className="error">{errors.receiverBIC}</span>}
        </div>

        <div className="form-group">
          <label>Transaction Type:</label>
          <select
            name="transactionType"
            value={formData.transactionType}
            onChange={handleInputChange}
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>

        <div className="form-group">
          <label>ISIN:</label>
          <input
            type="text"
            name="isin"
            value={formData.isin}
            onChange={handleInputChange}
            required
          />
          {errors.isin && <span className="error">{errors.isin}</span>}
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </div>

        <div className="form-group">
          <label>Currency:</label>
          <input
            type="text"
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            required
          />
          {errors.currency && <span className="error">{errors.currency}</span>}
        </div>

        <div className="form-group">
          <label>Trade Date (YYYYMMDD):</label>
          <input
            type="text"
            name="tradeDate"
            value={formData.tradeDate}
            onChange={handleInputChange}
            required
          />
          {errors.tradeDate && <span className="error">{errors.tradeDate}</span>}
        </div>

        <div className="form-group">
          <label>Settlement Date (YYYYMMDD):</label>
          <input
            type="text"
            name="settlementDate"
            value={formData.settlementDate}
            onChange={handleInputChange}
            required
          />
          {errors.settlementDate && <span className="error">{errors.settlementDate}</span>}
        </div>

        <div className="form-group">
          <label>Account Number:</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="generate-button">Generate MT541</button>
      </form>

      {messageOutput && (
        <div className="message-output">
          <h2>Generated SWIFT MT541 Message:</h2>
          <pre>{messageOutput}</pre>
        </div>
      )}
    </div>
  );
};

export default SwiftMT541Creator;