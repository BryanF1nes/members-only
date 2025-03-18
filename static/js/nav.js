(function main() {
    const openMenuBtn = document.querySelector("#open-menu");
    const closeMenuBtn = document.querySelector("#close-menu")
    const navMenu = document.querySelector("#nav-menu");
    
    openMenuBtn.addEventListener("click", () => {
        navMenu.classList.remove("hidden");
    });
    
    closeMenuBtn.addEventListener("click", () => {
        navMenu.classList.add("hidden")
    });

})()