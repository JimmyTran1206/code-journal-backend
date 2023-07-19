export async function addEntry(entry) {
  try {
    const reqMethod = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    };
    const response = await fetch('/api/entries', reqMethod);
    if (!response.ok) {
      throw new Error(`fetching error status ${response.status}`);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function updateEntry(entry) {
  try {
    const reqMethod = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    };
    const response = await fetch(`/api/entries/${entry.entryId}`, reqMethod);
    if (!response.ok) {
      throw new Error(`fetching error status ${response.status}`);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function removeEntry(entryId) {
  try {
    const reqMethod = {
      method: 'DELETE',
    };
    const response = await fetch(`/api/entries/${entryId}`, reqMethod);
    if (!response.ok) {
      throw new Error(`fetching error status ${response.status}`);
    }
  } catch (err) {
    console.error(err);
  }
}
