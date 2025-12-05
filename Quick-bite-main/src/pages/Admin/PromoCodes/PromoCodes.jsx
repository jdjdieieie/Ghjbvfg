import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import api from '../../../config/api';
import { toast } from 'react-toastify';
import './PromoCodes.css';

const defaultForm = {
  code: '',
  title: '',
  description: '',
  discountType: 'FLAT',
  discountValue: '',
  maxDiscountAmount: '',
  minOrderAmount: '',
  usageLimitPerCustomer: 1,
  maxRedemptions: '',
  validFrom: '',
  validUntil: '',
  active: true,
};

const toDateTimeInputValue = (value) => {
  if (!value) return '';
  if (value.length >= 16) {
    return value.slice(0, 16);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replace('T', ' ');
  return date.toLocaleString();
};

const parseNumeric = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const PromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(defaultForm);
  const [editingPromo, setEditingPromo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const summary = { active: 0, scheduled: 0, expired: 0 };
    promoCodes.forEach((promo) => {
      const start = promo.validFrom ? new Date(promo.validFrom) : null;
      const end = promo.validUntil ? new Date(promo.validUntil) : null;
      if (end && end < now) {
        summary.expired += 1;
      } else if (start && start > now) {
        summary.scheduled += 1;
      } else if (promo.active) {
        summary.active += 1;
      }
    });
    return summary;
  }, [promoCodes]);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/app4/api/v1/promocodes');
      setPromoCodes(response.data || []);
    } catch (error) {
      console.error('Failed to load promo codes', error);
      toast.error('Unable to load promo codes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? value : value,
    }));
  };

  const buildPayload = () => ({
    code: formData.code.trim(),
    title: formData.title.trim(),
    description: formData.description.trim(),
    discountType: formData.discountType,
    discountValue: parseNumeric(formData.discountValue) ?? 0,
    maxDiscountAmount: parseNumeric(formData.maxDiscountAmount),
    minOrderAmount: parseNumeric(formData.minOrderAmount),
    usageLimitPerCustomer: parseNumeric(formData.usageLimitPerCustomer) ?? 1,
    maxRedemptions: parseNumeric(formData.maxRedemptions),
    active: Boolean(formData.active),
    validFrom: formData.validFrom ? `${formData.validFrom}:00` : null,
    validUntil: formData.validUntil ? `${formData.validUntil}:00` : null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = buildPayload();
      if (editingPromo) {
        await api.put(`/app4/api/v1/promocodes/${editingPromo.id}`, payload);
        toast.success('Promo code updated');
      } else {
        await api.post('/app4/api/v1/promocodes', payload);
        toast.success('Promo code created');
      }
      resetForm();
      fetchPromoCodes();
    } catch (error) {
      console.error('Failed to submit promo code', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      title: promo.title,
      description: promo.description || '',
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      maxDiscountAmount: promo.maxDiscountAmount ?? '',
      minOrderAmount: promo.minOrderAmount ?? '',
      usageLimitPerCustomer: promo.usageLimitPerCustomer ?? 1,
      maxRedemptions: promo.maxRedemptions ?? '',
      validFrom: toDateTimeInputValue(promo.validFrom),
      validUntil: toDateTimeInputValue(promo.validUntil),
      active: promo.active,
    });
  };

  const handleDelete = async (promo) => {
    const confirmed = window.confirm(`Delete promo code ${promo.code}?`);
    if (!confirmed) return;
    try {
      await api.delete(`/app4/api/v1/promocodes/${promo.id}`);
      toast.success('Promo code deleted');
      fetchPromoCodes();
      if (editingPromo?.id === promo.id) {
        resetForm();
      }
    } catch (error) {
      console.error('Failed to delete promo code', error);
    }
  };

  const handleToggleActive = async (promo) => {
    try {
      await api.put(`/app4/api/v1/promocodes/${promo.id}`, { active: !promo.active });
      toast.success(`Promo ${!promo.active ? 'activated' : 'paused'}`);
      fetchPromoCodes();
    } catch (error) {
      console.error('Failed to toggle promo code', error);
    }
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingPromo(null);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <AdminLayout>
      <section className="promo-page">
        <header className="promo-header">
          <h1>Promo Code Studio</h1>
          <p>Launch time-limited offers, monitor usage, and reactivate winning promos without leaving the dashboard.</p>
        </header>

        <div className="promo-stats">
          <div className="stat-card">
            <div className="stat-label">Active</div>
            <div className="stat-value">{stats.active}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Scheduled</div>
            <div className="stat-value">{stats.scheduled}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Expired</div>
            <div className="stat-value">{stats.expired}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Codes</div>
            <div className="stat-value">{promoCodes.length}</div>
          </div>
        </div>

        <div className="promo-grid">
          <article className="promo-card">
            <h2 className="form-title">{editingPromo ? `Edit ${editingPromo.code}` : 'Create Promo Code'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Code</label>
                <input
                  type="text"
                  name="code"
                  className="form-control"
                  maxLength={50}
                  value={formData.code}
                  onChange={handleChange}
                  required
                  disabled={!!editingPromo}
                />
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Discount Type</label>
                  <select
                    name="discountType"
                    className="form-control"
                    value={formData.discountType}
                    onChange={handleChange}
                  >
                    <option value="FLAT">Flat</option>
                    <option value="PERCENTAGE">Percentage</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    step="0.01"
                    name="discountValue"
                    className="form-control"
                    value={formData.discountValue}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Discount</label>
                  <input
                    type="number"
                    step="0.01"
                    name="maxDiscountAmount"
                    className="form-control"
                    value={formData.maxDiscountAmount}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Min Order Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    name="minOrderAmount"
                    className="form-control"
                    value={formData.minOrderAmount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Usage / Customer</label>
                  <input
                    type="number"
                    min="1"
                    name="usageLimitPerCustomer"
                    className="form-control"
                    value={formData.usageLimitPerCustomer}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Max Redemptions</label>
                  <input
                    type="number"
                    min="1"
                    name="maxRedemptions"
                    className="form-control"
                    value={formData.maxRedemptions}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Valid From</label>
                  <input
                    type="datetime-local"
                    name="validFrom"
                    className="form-control"
                    value={formData.validFrom}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valid Until</label>
                  <input
                    type="datetime-local"
                    name="validUntil"
                    className="form-control"
                    value={formData.validUntil}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="active"
                  className="form-control"
                  value={formData.active ? 'true' : 'false'}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      active: event.target.value === 'true',
                    }))
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Paused</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Saving…' : editingPromo ? 'Update Promo' : 'Create Promo'}
                </button>
                {editingPromo && (
                  <button type="button" className="secondary-btn" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </article>

          <article className="promo-table-card">
            <div className="table-header">
              <div>
                <h2>Live Promo Codes</h2>
                <p className="promo-muted">Track status, usage limits, and expiry windows.</p>
              </div>
              <div className="table-actions">
                <button onClick={fetchPromoCodes}>Refresh</button>
                <button onClick={resetForm}>New</button>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">Loading promo codes…</div>
            ) : promoCodes.length === 0 ? (
              <div className="empty-state">
                <h3>No promo codes yet</h3>
                <p>Create your first incentive using the form on the left.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="promo-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Discount</th>
                      <th>Validity</th>
                      <th>Status</th>
                      <th>Usage</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoCodes.map((promo) => (
                      <tr key={promo.id}>
                        <td>
                          <div>{promo.code}</div>
                          <small>{promo.title}</small>
                        </td>
                        <td>{promo.discountType}</td>
                        <td>
                          {promo.discountType === 'PERCENTAGE'
                            ? `${promo.discountValue}%`
                            : formatCurrency(promo.discountValue)}
                        </td>
                        <td>
                          <small>from {formatDate(promo.validFrom)}</small>
                          <br />
                          <small>to {formatDate(promo.validUntil)}</small>
                        </td>
                        <td>
                          <span className={`badge ${promo.active ? 'active' : 'inactive'}`}>
                            {promo.active ? 'Active' : 'Paused'}
                          </span>
                        </td>
                        <td>
                          {promo.totalRedemptions} / {promo.maxRedemptions ?? '∞'}
                        </td>
                        <td className="table-actions-col">
                          <button className="action-btn edit" onClick={() => handleEdit(promo)}>
                            Edit
                          </button>
                          <button className="action-btn toggle" onClick={() => handleToggleActive(promo)}>
                            {promo.active ? 'Pause' : 'Activate'}
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(promo)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </div>
      </section>
    </AdminLayout>
  );
};

export default PromoCodes;
