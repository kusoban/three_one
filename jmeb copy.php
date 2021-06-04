<?php
$filepath = __DIR__ . '\jmeb.txt';
$f = fopen($filepath, 'a+');
echo $f ? 'opened' : 'not opened';
if (flock($f, LOCK_EX)) {
	fwrite($f, '--jmeb1',);
	sleep(5);
	fwrite($f, '--jmeb2',);
	flock($f, LOCK_UN);
} else {
	echo 'no';
}
