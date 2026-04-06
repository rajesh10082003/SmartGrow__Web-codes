import subprocess
output = subprocess.check_output(['netsh', 'wlan', 'show', 'networks', 'mode=bssid'], text=True, errors='replace')
with open('dump2.txt', 'w', encoding='utf-8') as f:
    f.write(output)
