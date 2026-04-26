import React, { useState } from 'react';
import styled from 'styled-components';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/Toast';
import { Spinner } from '../ui/Spinner';
import {
  Card, SectionLabel, SectionTitle,
  InlineRow, SmBtn, DestructiveBtn, cardAnim,
} from './portal.styled';

const KeyInput = styled.input`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  background: rgba(0, 0, 0, 0.45);
  color: var(--color-primary);
`;

const CustomKeyInput = styled.input`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.45);

  &:focus {
    outline: none;
    border-color: rgba(0, 242, 254, 0.45);
    box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.08);
  }
`;

const BtnContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
`;

export const PortalAccessKeys: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [accessKey] = useState('EULR-XXXXXXXX-XXXX');
  const [customKey, setCustomKey] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveKey = async () => {
    const trimmed = customKey.trim();
    if (!trimmed || !user) return;

    setSaving(true);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { customIntegrationKey: trimmed },
        { merge: true }
      );
      toast('Integration key saved to your account.', 'success');
      setCustomKey('');
    } catch {
      toast('Failed to save key. Check your connection and try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRotate = () => {
    toast('Key rotation is not yet enabled in Early Access.', 'info');
  };

  const handleRevoke = () => {
    toast('Key revocation will be available in the next release.', 'info');
  };

  return (
    <Card {...cardAnim} transition={{ duration: 0.4 }}>
      <SectionLabel>Access Keys</SectionLabel>
      <SectionTitle>API Integration</SectionTitle>
      <p style={{ color: 'var(--color-text-dim)', fontSize: '0.88rem', marginBottom: '1rem' }}>
        Your read-only market key. Paste a custom integration key from your AI provider below to link scribes directly to your account.
      </p>

      <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
        Platform Key
      </label>
      <InlineRow style={{ marginBottom: '1.25rem' }}>
        <KeyInput type="text" value={accessKey} readOnly />
        <SmBtn onClick={handleRotate}>Rotate</SmBtn>
        <DestructiveBtn onClick={handleRevoke}>Revoke</DestructiveBtn>
      </InlineRow>

      <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
        Custom Integration Key
      </label>
      <InlineRow>
        <CustomKeyInput
          type="text"
          placeholder="Paste your provider API key here (e.g. sk-...)"
          value={customKey}
          onChange={e => setCustomKey(e.target.value)}
          disabled={saving}
        />
        <SmBtn onClick={handleSaveKey} disabled={!customKey.trim() || saving}>
          <BtnContent>
            {saving && <Spinner size="0.85em" />}
            {saving ? 'Saving…' : 'Save'}
          </BtnContent>
        </SmBtn>
      </InlineRow>
    </Card>
  );
};
