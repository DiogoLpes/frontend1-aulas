class SharedFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <footer class="footer">
    <p>&copy; 2025 DevAnswers. All rights reserved.</p> 
    </footer>
    `;
    }
}
customElements.define("shared-component", SharedFooter);


class SharedHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
       <header class="header">
        <div class="navbar">
                <div class="logo">
                    <span class="bracket">[</span>
                    <span class="logo-text">DevAnswers</span>
                    <span class="bracket">]</span>
                </div>
            <nav class="nav">
                <a href="index.html" class="nav-link active">Home</a>
                <a href="Tags.html" class="nav-link">Tags</a>
                <a href="contacts.html" class="nav-link">Contacts</a>   
                <button id="theme-toggle" class="theme-toggle">Dark Mode</button>
            </nav>
        </div>
    </header>
    `;
    }
}
customElements.define("shared-header", SharedHeader);