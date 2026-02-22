@echo off
chcp 65001 >nul
color 0A

:: ========================================
:: NO CONFIGURATION NEEDED - USES CURRENT DIRECTORY
:: ========================================
set "target_path=%cd%"
set "output_file=%cd%\full_tree.txt"
:: ========================================

cls
echo ========================================
echo         DIRECTORY TREE EXPLORER
echo ========================================
echo.
echo CURRENT DIRECTORY: %target_path%
echo OUTPUT FILE: %output_file%
echo.
echo ========================================
echo.
echo [DIRECTORY TREE STRUCTURE]
echo ============================
tree "%target_path%" /f /a
echo.
echo ============================
echo.
echo Saving results to file...
echo.

(
    echo ========================================
    echo DIRECTORY TREE REPORT
    echo ========================================
    echo Date: %date% - %time%
    echo Directory: %target_path%
    echo ========================================
    echo.
    tree "%target_path%" /f /a
    echo.
    echo ========================================
    echo COMPLETE FILE LISTING
    echo ========================================
    echo.
    dir "%target_path%" /s /b
) > "%output_file%"

echo [SUCCESS] File saved to: %output_file%
echo.
echo ========================================
echo Press any key to exit...
pause >nul