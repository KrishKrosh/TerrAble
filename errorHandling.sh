# #!/bin/bash
# while
# do
#     if ([$? -eq 1] || [$? -eq 1] )
#     then 
#         terrain deploy counter --signer bombay --network testnet 
#     fi
#     echo "Deploying counter contract"
# done

A=0
while :
do
	if [ $A==1 ] && [ $? -eq 1 ] 
	then
        echo "Deploying counter contract"
        terrain deploy counter --signer bombay --network testnet 
        sleep 5
    else
        if [ $A==0 ] 
        then
            echo "Deploying counter contract"
            A=1
            terrain deploy counter --signer bombay --network testnet 
            sleep 5
            continue
        fi
        A=1
        echo $A
        break
	fi
done