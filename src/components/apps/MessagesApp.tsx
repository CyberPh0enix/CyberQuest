"use client";

import { useState, useEffect } from "react";
import styles from "./MessagesApp.module.css";
import AppContainer from "../os/AppContainer";
import { useOS } from "@/context/OSContext";
import { ChevronLeft } from "lucide-react";

export default function MessagesApp() {
  const { notifications, markNotificationsRead } = useOS();
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Group notifications by sender
  const chats = notifications.reduce((acc, notif) => {
    if (!acc[notif.sender]) acc[notif.sender] = [];
    acc[notif.sender].push(notif);
    return acc;
  }, {} as Record<string, typeof notifications>);

  const senders = Object.keys(chats);

  // When opening the app, mark everything as read
  useEffect(() => {
    markNotificationsRead();
  }, []);

  return (
    <AppContainer appId="messages" appName="Messages">
      <div className={styles.appWrapper}>
        {activeChat ? (
          <div className={styles.chatView}>
            <div className={styles.chatHeader}>
              <button className={styles.backBtn} onClick={() => setActiveChat(null)}>
                <ChevronLeft size={24} />
                <span>Filters</span>
              </button>
              <div className={styles.chatTitle}>
                <div className={styles.avatar}>{activeChat.charAt(0).toUpperCase()}</div>
                <span>{activeChat}</span>
              </div>
              <div style={{ width: 80 }}></div>
            </div>
            
            <div className={styles.chatBody}>
              {chats[activeChat].map((msg) => (
                <div key={msg.id} className={styles.messageBubble}>
                  <div className={styles.messageText}>{msg.text}</div>
                  <div className={styles.messageTime}>{msg.time}</div>
                </div>
              ))}
            </div>
            
            <div className={styles.chatInputBlock}>
              <div className={styles.chatInput}>Text Message</div>
            </div>
          </div>
        ) : (
          <div className={styles.listView}>
            <div className={styles.header}>
              <span>Messages</span>
            </div>
            <div className={styles.list}>
              {senders.length === 0 ? (
                <div className={styles.empty}>No messages yet</div>
              ) : (
                senders.map(sender => (
                  <div key={sender} className={styles.listItem} onClick={() => setActiveChat(sender)}>
                    <div className={styles.avatarLarge}>{sender.charAt(0).toUpperCase()}</div>
                    <div className={styles.listContent}>
                      <div className={styles.listTop}>
                        <span className={styles.listName}>{sender}</span>
                        <span className={styles.listTime}>{chats[sender][0].time}</span>
                      </div>
                      <div className={styles.listPreview}>
                        {chats[sender][0].text}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </AppContainer>
  );
}
