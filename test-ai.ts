import 'dotenv/config';
import { generateBlogPost } from './server/services/ai-content-generator';

async function testAIContent() {
  try {
    console.log('🔄 Blog post generatsiya qilinmoqda...');
    
    // O'zbek tilida test
    const postUz = await generateBlogPost('uz');
    console.log('\n✅ O\'zbekcha blog post:');
    console.log('---\n', postUz.title);
    console.log('\nExcerpt:', postUz.excerpt);
    console.log('\nTags:', postUz.tags);
    console.log('\nSlug:', postUz.slug);
    
    // Rus tilida test
    const postRu = await generateBlogPost('ru');
    console.log('\n✅ Ruscha blog post:');
    console.log('---\n', postRu.title);
    
  } catch (error) {
    console.error('❌ Xatolik yuz berdi:', error);
  }
}

testAIContent();
