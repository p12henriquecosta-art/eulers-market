import React from 'react';
import type { PurchaseRow, Invoice } from './portal.types';
import {
  Card, SectionLabel, TwoCol, Table, Th, Td, StatusPill, InvoiceRow, cardAnim,
} from './portal.styled';

const PURCHASE_HISTORY: PurchaseRow[] = [];
const INVOICES: Invoice[] = [];

export const PortalHistory: React.FC = () => (
  <TwoCol>
    {/* Purchase History */}
    <Card {...cardAnim} transition={{ duration: 0.4, delay: 0.05 }}>
      <SectionLabel>Purchase History</SectionLabel>
      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Product</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {PURCHASE_HISTORY.length === 0 ? (
            <tr>
              <Td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No purchases yet. Subscribe to a plan above to get started.
              </Td>
            </tr>
          ) : (
            PURCHASE_HISTORY.map((row, i) => (
              <tr key={i}>
                <Td>{row.date}</Td>
                <Td style={{ color: 'var(--color-text)' }}>{row.product}</Td>
                <Td>{row.amount}</Td>
                <Td><StatusPill $status={row.status}>{row.status}</StatusPill></Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>

    {/* Billing & Invoices */}
    <Card {...cardAnim} transition={{ duration: 0.4, delay: 0.1 }}>
      <SectionLabel>Billing &amp; Invoices</SectionLabel>
      {INVOICES.length === 0 ? (
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', padding: '1.5rem 0', textAlign: 'center' }}>
          No invoices yet. Invoices are generated automatically 24h after each successful payment.
        </p>
      ) : (
        INVOICES.map((inv, i) => (
          <InvoiceRow key={i}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{inv.date}</span>
            <span style={{ color: 'var(--color-text-dim)' }}>{inv.label}</span>
            <a
              href="#"
              onClick={e => e.preventDefault()}
              style={{ color: 'var(--color-primary)', fontSize: '0.82rem', textDecoration: 'none', flexShrink: 0 }}
            >
              ↓ PDF
            </a>
          </InvoiceRow>
        ))
      )}
    </Card>
  </TwoCol>
);
