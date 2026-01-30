import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostCategory } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(title: string, content: string, category: PostCategory, user: User) {
    if (category === PostCategory.NOTICE && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('공지사항은 관리자만 작성할 수 있습니다.');
    }

    const post = this.postsRepository.create({
      title,
      content,
      category,
      author: { id: user.id } as any,
    });

    const savedPost = await this.postsRepository.save(post);

    return this.findOne(savedPost.id);
  }

  async findAll() {
    return await this.postsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author']
    });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    return post;
  }

  async remove(id: string, user: User) {
    const post = await this.findOne(id);

    if (post.author.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    return await this.postsRepository.remove(post);
  }
  async addComment(postId: string, content: string, user: User) {
    const post = await this.findOne(postId);
    const comment = this.commentRepository.create({
      content,
      author: user,
      post,
    });
    return await this.commentRepository.save(comment);
  }
}