import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { ApplicationService } from './services/applicationService';
import { ResumeParser } from './services/resumeParser';

// Initialize services
const applicationService = new ApplicationService(process.env.REACT_APP_OPENAI_API_KEY);
const resumeParser = new ResumeParser(process.env.REACT_APP_OPENAI_API_KEY);

function App() {
  // Form state
  const [jobDescription, setJobDescription] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [resumeContext, setResumeContext] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  // Output state
  const [email, setEmail] = useState('');
  const [memo, setMemo] = useState('');
  const [qualityScore, setQualityScore] = useState(null);
  const [analysisDetails, setAnalysisDetails] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [parsingResume, setParsingResume] = useState(false);

  // Load saved resume context from localStorage on component mount
  useEffect(() => {
    const savedResumeContext = localStorage.getItem('savedResumeContext');
    if (savedResumeContext) {
      setResumeContext(savedResumeContext);
    }
  }, []);

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setParsingResume(true);
    setError(null);

    try {
      // Read file content
      const resumeText = await resumeParser.readFileContent(file);
      
      // Parse resume text to JSON
      const parsedResume = await resumeParser.parseResume(resumeText);
      
      // Store in localStorage and state
      const formattedJSON = JSON.stringify(parsedResume, null, 2);
      localStorage.setItem('savedResumeContext', formattedJSON);
      setResumeContext(formattedJSON);
      
      setSuccess(true);
    } catch (err) {
      setError('Failed to parse resume: ' + err.message);
    } finally {
      setParsingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let resumeContextObj = null;
      try {
        resumeContextObj = JSON.parse(resumeContext);
      } catch {
        setError('Invalid resume context JSON format');
        setLoading(false);
        return;
      }

      const response = await applicationService.generateMaterials(
        jobDescription,
        companyDescription,
        resumeContextObj
      );

      setEmail(response.email);
      setMemo(response.memo);
      setQualityScore(response.quality_score);
      setAnalysisDetails(response);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderEmail = (email) => {
    if (!email) return null;
    return (
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">Subject: {email.subject_line}</Typography>
        <Typography paragraph>{email.greeting}</Typography>
        {email.body_paragraphs.map((paragraph, index) => (
          <Typography key={index} paragraph>{paragraph}</Typography>
        ))}
        <Typography paragraph>{email.closing}</Typography>
        <Typography>{email.signature}</Typography>
        {email.follow_up_note && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            {email.follow_up_note}
          </Typography>
        )}
      </Box>
    );
  };

  const renderMemo = (memo) => {
    if (!memo) return null;
    return (
      <Box>
        <Typography variant="h6" gutterBottom>{memo.title}</Typography>
        <Box mb={2}>
          <Typography variant="subtitle2">Author Information:</Typography>
          <Typography>{memo.author_info.name}</Typography>
          <Typography>{memo.author_info.email}</Typography>
          <Typography>{memo.author_info.phone}</Typography>
        </Box>
        {memo.sections.map((section, index) => (
          <Box key={index} mb={2}>
            <Typography variant="subtitle1" fontWeight="bold">{section.title}</Typography>
            <Typography paragraph>{section.content}</Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          MCP Job Application Generator
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  multiline
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                  placeholder="Paste the job description here..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Description"
                  multiline
                  rows={4}
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  required
                  placeholder="Describe the company..."
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <input
                    accept=".txt,.pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="resume-file-input"
                    type="file"
                    onChange={handleResumeUpload}
                  />
                  <label htmlFor="resume-file-input">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      disabled={parsingResume}
                    >
                      {parsingResume ? (
                        <>
                          <CircularProgress size={24} sx={{ mr: 1 }} />
                          Parsing Resume...
                        </>
                      ) : (
                        'Upload Resume'
                      )}
                    </Button>
                  </label>
                  {resumeFile && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Uploaded: {resumeFile.name}
                    </Typography>
                  )}
                </Box>
                <TextField
                  fullWidth
                  label="Resume Context (JSON)"
                  multiline
                  rows={6}
                  value={resumeContext}
                  onChange={(e) => setResumeContext(e.target.value)}
                  helperText="Resume data in JSON format (automatically filled when you upload a resume)"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generate Application Materials'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {qualityScore !== null && (
          <Paper sx={{ p: 3, mb: 3, bgcolor: qualityScore >= 90 ? '#e8f5e9' : '#fff3e0' }}>
            <Typography variant="h6" gutterBottom>
              Quality Score: {qualityScore.toFixed(2)}%
            </Typography>
          </Paper>
        )}

        {email && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Generated Email
            </Typography>
            <Card variant="outlined">
              <CardContent>
                {renderEmail(email)}
              </CardContent>
            </Card>
          </Paper>
        )}

        {memo && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Generated Memo
            </Typography>
            <Card variant="outlined">
              <CardContent>
                {renderMemo(memo)}
              </CardContent>
            </Card>
          </Paper>
        )}

        {analysisDetails && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Analysis Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Context Analysis</Typography>
                    <Typography variant="subtitle2">Job Requirements:</Typography>
                    <Typography paragraph>{analysisDetails.context_analysis.job_requirements.join(", ")}</Typography>
                    <Typography variant="subtitle2">Company Culture:</Typography>
                    <Typography paragraph>{analysisDetails.context_analysis.company_culture.join(", ")}</Typography>
                    <Typography variant="subtitle2">Key Skills Matched:</Typography>
                    <Typography>{analysisDetails.context_analysis.key_skills_matched.join(", ")}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Strategy</Typography>
                    <Typography variant="subtitle2">Approach:</Typography>
                    <Typography paragraph>{analysisDetails.strategy.approach}</Typography>
                    <Typography variant="subtitle2">Key Points:</Typography>
                    <Typography>{analysisDetails.strategy.key_points.join(", ")}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Snackbar
          open={error !== null}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            {resumeFile ? 'Resume parsed successfully!' : 'Application materials generated successfully!'}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default App; 