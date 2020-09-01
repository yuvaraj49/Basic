#! /bin/bash

# This script is simulates a simple calculator with 4 arithmetic operations

op=1;
while [ $op -ne 0 ]
do
	read -p "Enter first operand : " a
	read -p "Enter second operand : " b
	echo "1. Add";
	echo "2. Subtract";
	echo "3. Multiply";
	echo "4. Divide";
	read -p "Enter option : " ch
	
	case $ch in
		1) echo "result : $((a+b))";;
		2) echo "result : $((a-b))";;
		3) echo "result : $((a*b))";;
		4) if [ $b -ne 0 ]
		   then
			   echo "result : $((a/b));";
		   else
			   echo "Division by zero error";
		   fi;;
		*) echo "Enter valid option";;
	esac
	
	read -p "To continue, press 1 : " op
	echo 
done
