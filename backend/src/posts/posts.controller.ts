import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { PostCategory } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('category') category: PostCategory,
    @Request() req: any,
  ) {
    return this.postsService.create(title, content, category, req.user);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.postsService.remove(id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  async addComment(@Param('id') postId: string, @Body('content') content: string, @Request() req: any) {
    return await this.postsService.addComment(postId, content, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('comments/:commentId')
  removeComment(
    @Param('commentId') commentId: string, 
    @Request() req: any
  ) {
    return this.postsService.removeComment(commentId, req.user);
  }
}