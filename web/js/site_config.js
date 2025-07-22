// Head

document.addEventListener("DOMContentLoaded", function() {
    fetch('/json/config/site_config.json')
        .then(response => response.json())
        .then(data => {
            const headContainer = document.getElementById('head');

            if (data.length > 0) {
                const headData = data[0];

                const headImg = document.createElement('link');
                headImg.rel = "icon";
                headImg.type = "image/png";
                headImg.href = headData.header_img

                const headTitle = document.createElement('title');
                headTitle.textContent = headData.header_title;

                headContainer.appendChild(headImg);
                headContainer.appendChild(headTitle);

                const metaRefresh = document.createElement('meta');
                metaRefresh.httpEquiv = "refresh";
                metaRefresh.content = headData.web_refresh;
                headContainer.appendChild(metaRefresh);
            }
        })
        .catch(error => console.error('Error fetching the head data:', error));
});


//  NAV

document.addEventListener("DOMContentLoaded", function() {
    fetch('/json/config/site_config.json')
        .then(response => response.json())
        .then(data => {
            const profileContainer = document.getElementById('profile');

            if (data.length > 0) {
                const profileData = data[0];

                if (profileData.img?.trim() !== '') {
                    const profileImg = document.createElement('img');
                    profileImg.className = "profileImg";
                    profileImg.src  = profileData.img;
                    profileContainer.appendChild(profileImg);
                }

                if (profileData.title?.trim() !== '') {
                    const profileTitle = document.createElement('h1');
                    profileTitle.textContent = profileData.title;
                    profileContainer.appendChild(profileTitle);
                }

            }
        })
        .catch(error => console.error('Error fetching the profile data:', error));
});