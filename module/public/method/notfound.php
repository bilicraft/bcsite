<?php
if($e = IO::r('m')){
    IO::e(-1, '错误：找不到方法"' . $e . '"');
}
IO::e(-1, '错误：找不到可用方法');