### Using the cluster
* Running the notebook
	```
	ssh <username>@cycles.cs.princeton.edu
	cd proj
	source bin/activate
	jupyter notebook --no-browser --port=8887
	```
   
* Linking
	```
	[local] ssh -N -L localhost:8885:localhost:8887 <username>@cycles.cs.princeton.edu
	```
	Then navigate to localhost:8885 in your browser
    
* Transfer files
	```
	[remote->local] 
    scp [username]@cycles.cs.princeton.edu:~\<remote_filename> <local_filename>
    
    [local->remote] 
    scp <username>@cycles.cs.princeton.edu:~\\<remote_filename>
	```


