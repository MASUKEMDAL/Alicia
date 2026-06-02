// PLAYER

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", () => {

    if(audio.paused){

        audio.play();
        playBtn.innerHTML = "❚❚";

    } else {

        audio.pause();
        playBtn.innerHTML = "▶";

    }

});


// DATA DE INÍCIO DO NAMORO

const startDate = new Date("2023-01-01");

function updateCounter(){

    const now = new Date();

    let diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = (days % 365) % 30;

    document.getElementById("relationship-time").innerHTML =
        `${years} anos, ${months} meses e ${remainingDays} dias ❤️`;

}

updateCounter();
setInterval(updateCounter, 1000);