-- for now with real newlines

insert into mazes.maze values(nextval('mazes.maze_seq'),'Maze 30x20',
'##############################\n'||
'#                            #\n'||
'#  #         # ##            #\n'||
'# .####         #            #\n'||
'####            #        #####\n'||
'#    #            #          #\n'||
'#  ###         ####          #\n'||
'#  #           #             #\n'||
'#    #               MMM     #\n'||
'#                            #\n'||
'#  #         # ##            #\n'||
'#  #         # ##            #\n'||
'#  #         # ##            #\n'||
'#  ####         #            #\n'||
'####            #        #####\n'||
'#    #            #          #\n'||
'#  ###         ####         @#\n'||
'#  #           #             #\n'||
'#    #                       #\n'||
'##############################\n',
null,'Just a maze with 3 monster','M', now(),'admin',now(),'admin');

