'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { PageHeader, type PageHeaderProps } from '@ladom/ui/pro';
import styles from './hr.module.css';

/** Where a screen's title and actions go: the start and end of the shell's sticky header. */
export const HrHeaderSlots = createContext<{ title: HTMLElement | null; actions: HTMLElement | null }>({ title: null, actions: null });

/** A screen's PageHeader, shown at the start of the sticky header; its actions go before the search. */
export function HrHeader({ actions, ...props }: Omit<PageHeaderProps, 'variant' | 'className'> & { actions?: ReactNode }) {
  const slots = useContext(HrHeaderSlots);
  return (
    <>
      {slots.title && createPortal(<PageHeader className={styles.pageHeader} {...props} />, slots.title)}
      {slots.actions && actions != null && createPortal(actions, slots.actions)}
    </>
  );
}
