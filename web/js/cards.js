document.addEventListener("DOMContentLoaded", function () {
    const pathParts = window.location.pathname.split('/').filter(part => part);
    const siteName = pathParts[pathParts.length - 1];
    const fetchUrl = `/json/${siteName}.json`;

    let allDevices = [];

    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allDevices = data;
            renderDevices(data);
        })
        .catch(error => console.error('Error fetching the data:', error));

    function renderDevices(data) {
        const container = document.getElementById('jsonContainer');
        container.innerHTML = ""; // Clear existing content

        const failedDevices = data.filter(device => device.status === 'failed');
        const successDevices = data.filter(device => device.status === 'success');

        function createDeviceCard(device) {
            const deviceDiv = document.createElement('div');
            deviceDiv.classList.add('deviceCard');

            const deviceDivTextContent = document.createElement('div');
            deviceDivTextContent.classList.add('deviceDivTextContent');
            deviceDiv.appendChild(deviceDivTextContent);

            const deviceName = document.createElement('h3');
            deviceName.innerHTML = device.device?.trim() !== '' ? device.device : `${device.ip} - ${device.description}`;
            deviceDivTextContent.appendChild(deviceName);

            if (device.device?.trim() !== '') {
                const deviceIP = document.createElement('p');
                deviceIP.innerHTML = `<strong>IP:</strong> ${device.ip}`;
                deviceDivTextContent.appendChild(deviceIP);

                const deviceDesc = document.createElement('p');
                deviceDesc.innerHTML = `<strong>DeviceDescription:</strong> ${device.device_description}`;
                deviceDivTextContent.appendChild(deviceDesc);

                const desc = document.createElement('p');
                desc.innerHTML = `<strong>IP Description:</strong> ${device.description}`;
                deviceDivTextContent.appendChild(desc);
            }

            const statusText = document.createElement('p');
            statusText.innerHTML = `<strong>Status:</strong> ${device.status}`;
            deviceDivTextContent.appendChild(statusText);

            const statusIndicator = document.createElement('i');
            statusIndicator.classList.add('statusIndicator');

            if (device.status === "success") {
                statusIndicator.classList.add('status-success');
            } else if (device.status === "failed") {
                statusIndicator.classList.add('status-failed');
            } else {
                statusIndicator.classList.add('status-unknown');
            }

            deviceDiv.appendChild(statusIndicator);
            return deviceDiv;
        }

        if (failedDevices.length > 0) {
            const failedHeader = document.createElement('h2');
            failedHeader.textContent = "⚠️ Failed Devices";
            container.appendChild(failedHeader);

            const failedWrapper = document.createElement('div');
            failedWrapper.classList.add('deviceGroup', 'failedDevices');
            failedDevices.forEach(device => {
                failedWrapper.appendChild(createDeviceCard(device));
            });
            container.appendChild(failedWrapper);
        }

        if (successDevices.length > 0) {
            const successHeader = document.createElement('h2');
            successHeader.textContent = "✅ Successful Devices";
            container.appendChild(successHeader);

            const successWrapper = document.createElement('div');
            successWrapper.classList.add('deviceGroup', 'successfulDevices');
            successDevices.forEach(device => {
                successWrapper.appendChild(createDeviceCard(device));
            });
            container.appendChild(successWrapper);
        }
    }

    // 🔍 Filter functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();

            const filtered = allDevices.filter(device => {
                return (
                    device.device?.toLowerCase().includes(query) ||
                    device.ip?.toLowerCase().includes(query) ||
                    device.device_description?.toLowerCase().includes(query) ||
                    device.description?.toLowerCase().includes(query) ||
                    device.status?.toLowerCase().includes(query)
                );
            });

            renderDevices(filtered);
        });
    }
});
