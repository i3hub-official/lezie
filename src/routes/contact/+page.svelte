<script lang="ts">
  let name = '';
  let email = '';
  let message = '';
  let submitted = false;

  function handleSubmit() {
    // In production, connect to your backend or email service
    submitted = true;
    // Reset form
    name = ''; email = ''; message = '';
  }
</script>

<svelte:head>
  <title>Contact Lezie - Get in Touch</title>
  <meta name="description" content="Contact the Lezie team for support, partnerships, or general inquiries about our community safety platform." />
</svelte:head>

<div class="page-container">
  <h1>Contact Us</h1>
  
  {#if submitted}
    <p>Thank you for your message. We will respond as soon as possible.</p>
  {:else}
    <form on:submit|preventDefault={handleSubmit}>
      <label>
        Name
        <input type="text" bind:value={name} required />
      </label>
      <label>
        Email
        <input type="email" bind:value={email} required />
      </label>
      <label>
        Message
        <textarea bind:value={message} rows="6" required></textarea>
      </label>
      <button type="submit">Send Message</button>
    </form>
  {/if}
</div>

<style>
  /* Form styling */
</style>