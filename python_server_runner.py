#!/usr/bin/env python3
# Скрипт для запуска сервера с обработкой ошибок

import os
import sys
import time
import subprocess
import signal
import logging

# Настройка логирования
logging.basicConfig(
    filename='python_server_logs.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def run_server():
    """Запускает Python сервер с обработкой прерываний."""
    
    logging.info("Запуск Python сервера...")
    
    server_process = None
    try:
        # Запускаем сервер как отдельный процесс
        server_process = subprocess.Popen(
            ["python3", "server.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        
        logging.info(f"Сервер запущен с PID: {server_process.pid}")
        
        # Перенаправляем вывод сервера в лог
        while server_process and server_process.poll() is None:
            if server_process.stdout:
                output = server_process.stdout.readline()
                if output:
                    logging.info(output.strip())
            
            time.sleep(0.1)
        
        # Проверяем, не завершился ли процесс
        if server_process:
            return_code = server_process.poll()
            if return_code is not None:
                logging.warning(f"Сервер завершился с кодом: {return_code}")
            
    except KeyboardInterrupt:
        logging.info("Получен сигнал прерывания, завершаем сервер...")
        if server_process:
            server_process.terminate()
            server_process.wait()
        logging.info("Сервер остановлен.")
    except Exception as e:
        logging.error(f"Ошибка при запуске сервера: {e}")
        
if __name__ == "__main__":
    run_server()