import subprocess
import json
output = subprocess.check_output(['netsh', 'wlan', 'show', 'networks', 'mode=bssid'], stderr=subprocess.STDOUT, text=True, errors='replace')
networks = {}
current_ssid = None
current_secured = False
for line in output.split('\n'):
    line = line.strip()
    if line.startswith('SSID'):
        parts = line.split(':', 1)
        if len(parts) > 1:
            ssid = parts[1].strip()
            if ssid and ssid != '""':
                current_ssid = ssid
            else:
                current_ssid = "Hidden Network"
            current_secured = True
    elif line.startswith('Authentication') and current_ssid:
        auth = line.split(':', 1)[-1].strip()
        if auth.lower() == 'open':
            current_secured = False
        else:
            current_secured = True
    elif line.startswith('Signal') and current_ssid:
        parts = line.split(':', 1)
        if len(parts) > 1:
            try:
                strength = int(parts[1].strip().replace('%', ''))
            except ValueError:
                strength = 0
            if current_ssid not in networks or networks[current_ssid]['strength_val'] < strength:
                networks[current_ssid] = {
                    "id": current_ssid,
                    "name": current_ssid,
                    "signal": "strong" if strength > 75 else "medium" if strength > 40 else "weak",
                    "secured": current_secured,
                    "type": "New",
                    "strength_val": strength
                }

net_list = list(networks.values())
net_list.sort(key=lambda x: x['strength_val'], reverse=True)
print(json.dumps(net_list, indent=2))
