param([string]$Out = "$PSScriptRoot\shot.png")
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
if (-not ('ShotUtil' -as [type])) {
Add-Type @"
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public class ShotUtil {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
  public static List<IntPtr> Windows(uint pid) {
    var res = new List<IntPtr>();
    EnumWindows((h, l) => {
      uint p; GetWindowThreadProcessId(h, out p);
      if (p == pid && IsWindowVisible(h)) {
        RECT r; GetWindowRect(h, out r);
        if (r.R - r.L > 200) res.Add(h);
      }
      return true;
    }, IntPtr.Zero);
    return res;
  }
}
"@
}
[void][ShotUtil]::SetProcessDPIAware()

$proc = Get-Process -Name 'Docker Desktop' | Where-Object { $_.MainWindowTitle -ne '' } | Select-Object -First 1
if (-not $proc) { throw 'Docker Desktop window not found' }
$h = [ShotUtil]::Windows([uint32]$proc.Id) | Select-Object -First 1
if (-not $h) { throw 'No capturable window handle' }
if ([ShotUtil]::IsIconic($h)) { [void][ShotUtil]::ShowWindow($h, 9); Start-Sleep -Milliseconds 800 }
[void][ShotUtil]::SetForegroundWindow($h)
Start-Sleep -Milliseconds 600

$r = New-Object ShotUtil+RECT
[void][ShotUtil]::GetWindowRect($h, [ref]$r)
$w = $r.R - $r.L; $hh = $r.B - $r.T
$bmp = New-Object System.Drawing.Bitmap($w, $hh)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($r.L, $r.T, 0, 0, $bmp.Size)
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
"saved: $Out (${w}x${hh})"
