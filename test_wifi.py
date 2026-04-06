import subprocess
import json
output = subprocess.check_output(['netsh', 'wlan', 'show', 'networks', 'mode=bssid'], text=True, errors='replace')
networks = {}
current_ssid = None
for line in output.split('\n'):
    line = line.strip()
    if line.startswith('SSID'):
        parts = line.split(':', 1)
        if len(parts) > 1:
            ssid = parts[1].strip()
            if ssid and ssid != '""':
                current_ssid = ssid
            else:
                current_ssid = 'Hidden Network'
    elif line.startswith('Signal') and current_ssid:
        parts = line.split(':', 1)
        if len(parts) > 1:
            strength = int(parts[1].strip().replace('%', ''))
            if current_ssid not in networks or networks[current_ssid] < strength:
                networks[current_ssid] = strength
            current_ssid = None

print(json.dumps(networks, indent=2))
