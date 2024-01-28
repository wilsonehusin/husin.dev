---
title: Integrating Svelte store with browser storage
aliases:
  - integrating-svelte-store-with-browser-storage
tags:
  - svelte
description: >-
  Bidirectional synchronization writable instance from Svelte store with external storage mechanism. This example demonstrates persistence using browser's `localStorage`.
---

```typescript
import { writable } from "svelte/store";
const key = "myKey";
const defaultValue = "myDefaultValue";

// Fetch value from storage, if any. Otherwise, use defaultValue.
const initialValue = localStorage.getItem(key) || defaultValue;

// Initialize writable instance with initial value.
const store = writable(initialValue);

// If the stored value changes, make sure to update localStorage too.
store.subscribe((v) => localStorage.setItem(key, JSON.stringify(v)));

// Make sure changes from a different tab is propagated by listening
// to browser storage events and updating writable instance as necessary.
window.addEventListener("storage", () => {
  const storedValueStr = localStorage.getItem(key);
  if (storedValueStr == null) return;
  if (storedValueStr === "undefined") {
    // "undefined" cannot go through JSON.parse
    store.set(undefined);
    return;
  }
  const localValue = JSON.parse(storedValueStr);
  if (localValue !== get(store)) store.set(localValue);
});

export default store;
```
