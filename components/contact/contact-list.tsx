"use client";

import { Check, Copy, ExternalLink, GitFork, Mail, MessageCircle, Send, Tv } from "lucide-react";
import { useRef, useState } from "react";
import { contacts } from "@/data/site";

const contactIcons = {
  qq: MessageCircle,
  github: GitFork,
  gmail: Mail,
  bilibili: Tv,
};

export function ContactList() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copyValue(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div className="contact-list">
      {contacts.map((contact) => {
        const Icon = contactIcons[contact.id];
        const copied = copiedId === contact.id;
        return (
          <div className="contact-row" key={contact.id}>
            <span className="contact-row__icon" aria-hidden="true">
              <Icon />
            </span>
            <strong>{contact.label}</strong>
            <span className="contact-row__value">{contact.value}</span>
            {contact.action === "copy" ? (
              <button type="button" onClick={() => copyValue(contact.id, contact.value)}>
                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                {copied ? "已复制" : "复制"}
              </button>
            ) : (
              <a
                href={contact.href}
                target={contact.action === "email" ? undefined : "_blank"}
                rel={contact.action === "email" ? undefined : "noopener noreferrer"}
              >
                {contact.action === "email" ? <Send aria-hidden="true" /> : <ExternalLink aria-hidden="true" />}
                {contact.action === "email" ? "发送邮件" : "访问主页"}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
